// This file acts as a client-side bridge to your Firebase Firestore database and Google Apps Script.
// It uses functions from the Firebase SDK to interact with your collections and GAS for merge operations.

// FIX: Removed incorrect Firebase v9 modular imports.
import { db, storage } from './firebase'; // Your Firebase config
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, limit, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { User, Template, MergeLog, BillingPlan, Notification, AuditLog, PaymentHistory } from '../types';
import { GasRequestParams, GasResponse, validateGasParams, formatGasError, formatGasSuccess } from './gasService';

// Helper to convert snapshot to array
const snapshotToArray = <T>(snapshot: any): T[] => {
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as T));
};

// --- User Management ---
export const getUsersData = async (): Promise<User[]> => {
    // FIX: Changed to Firebase v9 syntax.
    const userSnapshot = await getDocs(collection(db, 'users'));
    const users = snapshotToArray<User>(userSnapshot);
    console.log('Raw users from Firestore:', users);
    return users;
};

export const addUser = (user: Partial<User>) => {
    // In a real app, you would create the user in Firebase Auth first,
    // then create their profile document in Firestore.
    // This function assumes auth is handled separately.
    // FIX: Changed to Firebase v9 syntax.
    return addDoc(collection(db, 'users'), user);
};

export const updateUser = (userId: string, userData: Partial<User>) => {
    // FIX: Changed to Firebase v9 syntax.
    const userDocRef = doc(db, 'users', userId);
    return updateDoc(userDocRef, userData);
};

// Admin-only update function with full permissions
export const updateUserByAdmin = async (adminUser: User, targetUserId: string, userData: Partial<User>) => {
    // Check if the current user is an admin
    if (adminUser.role !== 'Admin') {
        throw new Error('Unauthorized: Only admins can perform this action');
    }

    // Prevent admins from modifying their own admin status (security measure)
    if (adminUser.id === targetUserId && userData.role && userData.role !== 'Admin') {
        throw new Error('Admins cannot remove their own admin privileges');
    }

    // FIX: Changed to Firebase v9 syntax.
    const userDocRef = doc(db, 'users', targetUserId);
    return updateDoc(userDocRef, userData);
};

// User-only update function with limited permissions
export const updateUserByUser = async (currentUser: User, userData: Partial<User>) => {
    // Users can only update their own data
    if (!currentUser.id) {
        throw new Error('User ID is required');
    }

    // Define allowed fields for user updates
    const allowedFields = ['profilePictureId', 'profilePictureUrl'];
    const filteredData: Partial<Pick<User, 'profilePictureId' | 'profilePictureUrl'>> = {};

    // Only allow updates to permitted fields
    allowedFields.forEach(field => {
        const value = userData[field as keyof User];
        if (value !== undefined) {
            filteredData[field as keyof typeof filteredData] = value as any;
        }
    });

    // If no allowed fields were provided, throw error
    if (Object.keys(filteredData).length === 0) {
        throw new Error('No valid fields to update. Users can only update profile picture.');
    }

    // FIX: Changed to Firebase v9 syntax.
    const userDocRef = doc(db, 'users', currentUser.id);
    return updateDoc(userDocRef, filteredData);
};

export const deleteUser = (userId: string) => {
    // FIX: Changed to Firebase v9 syntax.
    const userDocRef = doc(db, 'users', userId);
    return deleteDoc(userDocRef);
};

// Upload file to Firebase Storage and return the download URL and path
export const uploadFile = async (file: File): Promise<{ url: string; path: string }> => {
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `templates/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return { url, path: `templates/${fileName}` };
};

// --- Dashboard Data ---
export const getAdminDashboardData = async (): Promise<any> => {
    // This is a simplified example. A real implementation might use aggregated data.
    const users = await getUsersData();
    const merges = await getMergeLogsData();

    // Calculate real analytics data
    const totalUsers = users.length;
    const totalMerges = merges.length;
    const activeSubscriptions = users.filter(u => u.plan !== 'Free').length;

    // Calculate merge success/failure rates
    const successfulMerges = merges.filter(m => m.status === 'Success').length;
    const failedMerges = merges.filter(m => m.status === 'Failed').length;

    // Calculate API calls (estimate based on merges + other activities)
    const estimatedApiCalls = totalMerges * 3; // Rough estimate: 3 API calls per merge

    // Calculate user activity by role
    const adminUsers = users.filter(u => u.role === 'Admin').length;
    const regularUsers = users.filter(u => u.role !== 'Admin').length;

    // Calculate merge activity over last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentMerges = merges.filter(merge => {
        const mergeDate = new Date(merge.timestamp || merge.date);
        return mergeDate >= thirtyDaysAgo && mergeDate <= now;
    });

    // Group by day for the last 30 days
    const activityByDay: { [key: string]: number } = {};
    for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateKey = date.toISOString().split('T')[0];
        activityByDay[dateKey] = 0;
    }

    recentMerges.forEach(merge => {
        const mergeDate = new Date(merge.timestamp || merge.date);
        const dateKey = mergeDate.toISOString().split('T')[0];
        if (activityByDay.hasOwnProperty(dateKey)) {
            activityByDay[dateKey]++;
        }
    });

    const apiCallsLast30Days = Object.values(activityByDay).map(count => count * 3); // Estimate API calls

    return {
        totalUsers,
        totalMerges,
        activeSubscriptions,
        recentMerges: merges.slice(0, 5),
        apiCallsLast30Days,
        mergeStatus: { success: successfulMerges, failed: failedMerges },
        userActivity: { admins: adminUsers, users: regularUsers }
    };
};
export const getUserDashboardData = async (userEmail: string): Promise<any> => {
    console.log('getUserDashboardData: Fetching data for user:', userEmail);
    // FIX: Changed to Firebase v9 syntax. Remove orderBy to avoid index requirement for now
    const q = query(collection(db, 'mergeLogs'), where("user", "==", userEmail));
    const mergeSnapshot = await getDocs(q);
    const allUserMerges = snapshotToArray<MergeLog>(mergeSnapshot);
    console.log('getUserDashboardData: Found', allUserMerges.length, 'merge logs');

    // Sort in memory instead of using orderBy
    allUserMerges.sort((a, b) => {
        const timeA = new Date(a.timestamp || a.date).getTime();
        const timeB = new Date(b.timestamp || b.date).getTime();
        return timeB - timeA; // Descending order
    });

    // Calculate total merges, docs, slides
    const totalUserMerges = allUserMerges.length;
    const docsGenerated = allUserMerges.filter(l => l.type === 'Sheet to Docs').length;
    const slidesGenerated = allUserMerges.filter(l => l.type === 'Sheet to Slides').length;

    // Calculate success rate
    const successfulMerges = allUserMerges.filter(l => l.status === 'Success').length;
    const successRate = totalUserMerges > 0 ? Math.round((successfulMerges / totalUserMerges) * 100) : 0;

    // Count unique templates used
    const uniqueTemplates = new Set(allUserMerges.filter(l => l.templateId).map(l => l.templateId));
    const templatesUsed = uniqueTemplates.size;

    // Aggregate merge activity for the last 7 days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentMerges = allUserMerges.filter(merge => {
        const mergeDate = new Date(merge.timestamp || merge.date);
        return mergeDate >= sevenDaysAgo && mergeDate <= now;
    });

    // Group by day (last 7 days)
    const activityByDay: { [key: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
        activityByDay[dateKey] = 0;
    }

    recentMerges.forEach(merge => {
        const mergeDate = new Date(merge.timestamp || merge.date);
        const dateKey = mergeDate.toISOString().split('T')[0];
        if (activityByDay.hasOwnProperty(dateKey)) {
            activityByDay[dateKey]++;
        }
    });

    // Convert to array for chart (last 7 days, Mon-Sun or actual dates)
    const chartData = Object.values(activityByDay);

    const result = {
        totalUserMerges,
        docsGenerated,
        slidesGenerated,
        successRate,
        templatesUsed,
        mergeActivityLast7Days: chartData,
        recentUserMerges: allUserMerges.slice(0, 5)
    };
    console.log('getUserDashboardData: Returning data:', result);
    return result;
};

// --- Other Services ---
export const getAuditLogsData = async (filters: any): Promise<AuditLog[]> => {
    // FIX: Changed to Firebase v9 syntax.
    const logSnapshot = await getDocs(collection(db, 'auditLogs'));
    return snapshotToArray<AuditLog>(logSnapshot);
};

const GAS_URL = '/gas';

// For production environments, use the full URL directly
const getGasUrl = () => {
  // Check if we're in development (localhost) or production
  if (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1' || 
       window.location.hostname.startsWith('192.168.'))) {
    // In development, use the proxy
    return '/gas';
  } else {
    // In production, use the direct URL
    return getDirectGasUrl();
  }
};

// Add a fallback URL for additional reliability
const getDirectGasUrl = () => {
  // This is the URL from your error message
  return 'https://script.google.com/macros/s/AKfycbyjXDsJ5PL2N_91KIPNS2EUMIaoFiNxE5LV79RQN2emeyna5AaRriLzs29MZZjAEPXS/exec';
};

// CORS proxy service for production environments
const getCorsProxyUrl = (targetUrl: string) => {
  // Using a public CORS proxy service
  // Note: This is a temporary solution. For production, you should use your own proxy service
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
};

// Alternative CORS proxy services
const getAlternativeProxyUrls = (targetUrl: string) => {
  return [
    // Our own Netlify function proxy
    '/.netlify/functions/gas-proxy',
    // Public CORS proxy services
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
    `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
    `https://thingproxy.freeboard.io/fetch/${targetUrl}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`
  ];
};

// Enhanced fetch function with multiple proxy fallbacks
const fetchWithMultipleProxies = async (url: string, options: RequestInit, timeout: number = 30000): Promise<Response> => {
  // Try direct request first
  try {
    console.log('Trying direct request to:', url);
    return await fetchWithTimeoutAndRetry(url, options, timeout, 1);
  } catch (directError) {
    console.warn('Direct request failed:', directError);
    
    // Try multiple proxy services as fallbacks
    const proxyUrls = getAlternativeProxyUrls(url);
    
    for (const proxyUrl of proxyUrls) {
      try {
        console.log('Trying proxy:', proxyUrl);
        
        // Special handling for our Netlify function proxy
        if (proxyUrl === '/.netlify/functions/gas-proxy') {
          // For our Netlify function, we need to pass the original request data
          const proxyOptions = {
            ...options,
            method: 'POST', // Netlify function expects POST
            headers: {
              ...options.headers,
              'X-Requested-With': 'XMLHttpRequest',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            body: JSON.stringify({
              url: url,
              method: options.method || 'GET',
              headers: options.headers,
              body: options.body
            })
          };
          return await fetchWithTimeoutAndRetry(proxyUrl, proxyOptions, timeout, 0);
        } else {
          // For public proxies, we need to pass the target URL as a parameter
          const proxyOptions = {
            ...options,
            headers: {
              ...options.headers,
              'X-Requested-With': 'XMLHttpRequest',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          };
          return await fetchWithTimeoutAndRetry(proxyUrl, proxyOptions, timeout, 0);
        }
      } catch (proxyError) {
        console.warn('Proxy failed:', proxyUrl, proxyError);
        continue; // Try next proxy
      }
    }
    
    // If all proxies fail, throw the original error
    throw directError;
  }
};

// Add a timeout helper function
const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number = 30000): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  // Add CORS headers for all requests
  const fetchOptions: RequestInit = {
    ...options,
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Enhanced fetch function with fallback
const fetchWithFallback = async (primaryUrl: string, fallbackUrl: string, options: RequestInit, timeout: number = 30000): Promise<Response> => {
  try {
    // Try primary URL first
    return await fetchWithTimeout(primaryUrl, options, timeout);
  } catch (primaryError) {
    console.warn('Primary URL failed, trying fallback:', primaryError);
    try {
      // Try fallback URL
      return await fetchWithTimeout(fallbackUrl, options, timeout);
    } catch (fallbackError) {
      console.error('Both primary and fallback URLs failed:', primaryError, fallbackError);
      // Throw the primary error as it's more likely to be the relevant one
      throw primaryError;
    }
  }
};

// Add a timeout helper function with retry logic
const fetchWithTimeoutAndRetry = async (url: string, options: RequestInit, timeout: number = 30000, maxRetries: number = 3): Promise<Response> => {
  let lastError: any;
  
  for (let i = 0; i <= maxRetries; i++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    // Add CORS headers for all requests
    const fetchOptions: RequestInit = {
      ...options,
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...options.headers,
      },
    };
    
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;
      
      // If this is the last retry, throw the error
      if (i === maxRetries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  
  throw lastError;
};

// Enhanced fetch function with fallback and retry
const fetchWithFallbackAndRetry = async (primaryUrl: string, fallbackUrl: string, options: RequestInit, timeout: number = 30000, maxRetries: number = 3): Promise<Response> => {
  try {
    // Try primary URL first with retry logic
    return await fetchWithTimeoutAndRetry(primaryUrl, options, timeout, maxRetries);
  } catch (primaryError) {
    console.warn('Primary URL failed after retries, trying fallback:', primaryError);
    try {
      // Try fallback URL with retry logic
      return await fetchWithTimeoutAndRetry(fallbackUrl, options, timeout, maxRetries);
    } catch (fallbackError) {
      console.error('Both primary and fallback URLs failed after retries:', primaryError, fallbackError);
      // Throw the primary error as it's more likely to be the relevant one
      throw primaryError;
    }
  }
};

export const runSlidesMerge = async (params: GasRequestParams): Promise<GasResponse> => {
    console.log('Running slides merge:', params);

    // Validate parameters
    const validation = validateGasParams(params);
    if (!validation.isValid) {
        return formatGasError(validation.error);
    }

    try {
        // Check if we're in production or development
        const isDevelopment = typeof window !== 'undefined' && 
            (window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1' || 
             window.location.hostname.startsWith('192.168.'));
        
        let response: Response;
        
        if (isDevelopment) {
            // In development, use the local proxy
            console.log('Using local proxy for development environment');
            response = await fetchWithFallbackAndRetry(getGasUrl(), getDirectGasUrl(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...params, mode: 'slides', action: 'merge' }),
            }, 60000, 2); // 60 second timeout for merges, 2 retries
        } else {
            // In production, try direct URL first, then multiple proxies as fallback
            console.log('Using direct URL for production environment');
            response = await fetchWithMultipleProxies(getDirectGasUrl(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...params, mode: 'slides', action: 'merge' }),
            }, 60000); // 60 second timeout for merges
        }

        console.log('Received response from GAS:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('GAS response data:', result);
        
        if (result.error) throw new Error(result.error);
        return formatGasSuccess(result);
    } catch (error: any) {
        console.error('Slides merge error:', error);
        if (error.name === 'AbortError') {
            return formatGasError('Merge operation timed out. Please try again with fewer rows or check your internet connection.');
        }
        // Handle CORS errors specifically
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return formatGasError('Unable to connect to the merge service. This may be due to network restrictions or CORS policy. Please try again or contact support.');
        }
        return formatGasError(error);
    }
};

export const runDocsMerge = async (params: GasRequestParams): Promise<GasResponse> => {
    console.log('Running docs merge:', params);

    // Validate parameters
    const validation = validateGasParams(params);
    if (!validation.isValid) {
        return formatGasError(validation.error);
    }

    try {
        // Check if we're in production or development
        const isDevelopment = typeof window !== 'undefined' && 
            (window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1' || 
             window.location.hostname.startsWith('192.168.'));
        
        let response: Response;
        
        if (isDevelopment) {
            // In development, use the local proxy
            console.log('Using local proxy for development environment');
            response = await fetchWithFallbackAndRetry(getGasUrl(), getDirectGasUrl(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...params, mode: 'docs', action: 'merge' }),
            }, 60000, 2); // 60 second timeout for merges, 2 retries
        } else {
            // In production, try direct URL first, then multiple proxies as fallback
            console.log('Using direct URL for production environment');
            response = await fetchWithMultipleProxies(getDirectGasUrl(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...params, mode: 'docs', action: 'merge' }),
            }, 60000); // 60 second timeout for merges
        }

        console.log('Received response from GAS:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('GAS response data:', result);
        
        if (result.error) throw new Error(result.error);
        return formatGasSuccess(result);
    } catch (error: any) {
        console.error('Docs merge error:', error);
        if (error.name === 'AbortError') {
            return formatGasError('Merge operation timed out. Please try again with fewer rows or check your internet connection.');
        }
        // Handle CORS errors specifically
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return formatGasError('Unable to connect to the merge service. This may be due to network restrictions or CORS policy. Please try again or contact support.');
        }
        return formatGasError(error);
    }
};

export const runSlidesPreview = async (params: GasRequestParams): Promise<GasResponse> => {
    console.log('Running slides preview:', params);

    // Validate parameters
    const validation = validateGasParams(params);
    if (!validation.isValid) {
        return formatGasError(validation.error);
    }

    try {
        // Check if we're in production or development
        const isDevelopment = typeof window !== 'undefined' && 
            (window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1' || 
             window.location.hostname.startsWith('192.168.'));
        
        let response: Response;
        
        if (isDevelopment) {
            // In development, use the local proxy
            console.log('Using local proxy for development environment');
            response = await fetchWithFallbackAndRetry(getGasUrl(), getDirectGasUrl(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...params, mode: 'slides', action: 'preview' }),
            }, 30000, 2); // 30 second timeout for previews, 2 retries
        } else {
            // In production, try direct URL first, then multiple proxies as fallback
            console.log('Using direct URL for production environment');
            response = await fetchWithMultipleProxies(getDirectGasUrl(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...params, mode: 'slides', action: 'preview' }),
            }, 30000); // 30 second timeout for previews
        }

        console.log('Received response from GAS:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('GAS response data:', result);
        
        if (result.error) throw new Error(result.error);
        return formatGasSuccess(result);
    } catch (error: any) {
        console.error('Slides preview error:', error);
        if (error.name === 'AbortError') {
            return formatGasError('Preview generation timed out. Please try again or check your internet connection.');
        }
        // Handle CORS errors specifically
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return formatGasError('Unable to connect to the preview service. This may be due to network restrictions or CORS policy. Please try again or contact support.');
        }
        return formatGasError(error);
    }
};

export const runDocsPreview = async (params: GasRequestParams): Promise<GasResponse> => {
    console.log('Running docs preview:', params);

    // Validate parameters
    const validation = validateGasParams(params);
    if (!validation.isValid) {
        return formatGasError(validation.error);
    }

    try {
        // Check if we're in production or development
        const isDevelopment = typeof window !== 'undefined' && 
            (window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1' || 
             window.location.hostname.startsWith('192.168.'));
        
        let response: Response;
        
        if (isDevelopment) {
            // In development, use the local proxy
            console.log('Using local proxy for development environment');
            response = await fetchWithFallbackAndRetry(getGasUrl(), getDirectGasUrl(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...params, mode: 'docs', action: 'preview' }),
            }, 30000, 2); // 30 second timeout for previews, 2 retries
        } else {
            // In production, try direct URL first, then multiple proxies as fallback
            console.log('Using direct URL for production environment');
            response = await fetchWithMultipleProxies(getDirectGasUrl(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...params, mode: 'docs', action: 'preview' }),
            }, 30000); // 30 second timeout for previews
        }

        console.log('Received response from GAS:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('GAS response data:', result);
        
        if (result.error) throw new Error(result.error);
        return formatGasSuccess(result);
    } catch (error: any) {
        console.error('Docs preview error:', error);
        if (error.name === 'AbortError') {
            return formatGasError('Preview generation timed out. Please try again or check your internet connection.');
        }
        // Handle CORS errors specifically
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return formatGasError('Unable to connect to the preview service. This may be due to network restrictions or CORS policy. Please try again or contact support.');
        }
        return formatGasError(error);
    }
};

export const getTemplatesData = async (): Promise<Template[]> => {
    // FIX: Changed to Firebase v9 syntax.
    const templateSnapshot = await getDocs(collection(db, 'templates'));
    return snapshotToArray<Template>(templateSnapshot);
};
// FIX: Changed to Firebase v9 syntax.
export const addTemplate = async (template: Partial<Template>) => {
    const docRef = doc(collection(db, 'templates'), template.id);
    await setDoc(docRef, template);
    return docRef;
};
export const updateTemplate = (id: string, template: Partial<Template>) => updateDoc(doc(db, 'templates', id), template);
export const deleteTemplate = async (id: string) => {
    // Get the template to check if there's an image to delete
    const templateDoc = await getDocs(query(collection(db, 'templates'), where('id', '==', id)));
    if (!templateDoc.empty) {
        const templateData = templateDoc.docs[0].data() as Template;
        if (templateData.imagePath) {
            const imageRef = ref(storage, templateData.imagePath);
            try {
                await deleteObject(imageRef);
            } catch (error) {
                console.error('Error deleting image from storage:', error);
            }
        }
    }
    return deleteDoc(doc(db, 'templates', id));
};

export const getMergeLogsData = async (userEmail?: string): Promise<MergeLog[]> => {
    // FIX: Changed to Firebase v9 syntax.
    if (userEmail) {
        // Filter by user email for regular users
        const q = query(collection(db, 'mergeLogs'), where("user", "==", userEmail));
        const logSnapshot = await getDocs(q);
        return snapshotToArray<MergeLog>(logSnapshot);
    } else {
        // Admin gets all logs
        const logSnapshot = await getDocs(collection(db, 'mergeLogs'));
        return snapshotToArray<MergeLog>(logSnapshot);
    }
};

export const addMergeLog = async (log: Partial<MergeLog>) => {
    // FIX: Changed to Firebase v9 syntax.
    const docRef = await addDoc(collection(db, 'mergeLogs'), log);
    return docRef;
};

// FIX: Changed to Firebase v9 syntax.
export const deleteMergeLog = (id: string) => deleteDoc(doc(db, 'mergeLogs', id));

export const getBillingPlansData = async (): Promise<BillingPlan[]> => {
    // FIX: Changed to Firebase v9 syntax.
    const planSnapshot = await getDocs(collection(db, 'billingPlans'));
    return snapshotToArray<BillingPlan>(planSnapshot);
};
// FIX: Changed to Firebase v9 syntax.
export const addBillingPlan = (plan: Partial<BillingPlan>) => addDoc(collection(db, 'billingPlans'), plan);
export const updateBillingPlan = (id: string, plan: Partial<BillingPlan>) => updateDoc(doc(db, 'billingPlans', id), plan);
export const deleteBillingPlan = (id: string) => deleteDoc(doc(db, 'billingPlans', id));

export const getPaymentHistoryData = async (): Promise<PaymentHistory[]> => {
    // FIX: Changed to Firebase v9 syntax.
    const historySnapshot = await getDocs(collection(db, 'paymentHistory'));
    return snapshotToArray<PaymentHistory>(historySnapshot);
};

// FIX: Changed to Firebase v9 syntax.
export const sendNotification = (notification: { title: string, message: string, priority?: string, category?: string, actionUrl?: string, actionText?: string, actions?: any[] }) => addDoc(collection(db, 'notifications'), notification);

// FIX: Changed to Firebase v9 syntax.
export const addNotification = async (notification: Partial<Notification>) => {
    const docRef = doc(collection(db, 'notifications'), notification.id);
    await setDoc(docRef, notification);
    return docRef;
};
export const updateNotification = (id: string, notification: Partial<Notification>) => updateDoc(doc(db, 'notifications', id), notification);
export const deleteNotification = (id: string) => deleteDoc(doc(db, 'notifications', id));

/**
 * Generate embed-friendly preview URL for Google Docs or Slides
 * @param fileId - Google Docs/Slides file ID
 * @param mode - 'docs' | 'slides'
 * @returns preview URL string
 */
export function generatePreviewUrl(fileId: string, mode: 'docs' | 'slides'): string {
  if (!fileId) return '';

  switch (mode) {
    case 'slides':
      return `https://docs.google.com/presentation/d/${fileId}/preview`;
    case 'docs':
      return `https://docs.google.com/document/d/${fileId}/preview`;
    default:
      return '';
  }
}

// Toast notification helper
export const showToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, duration?: number, action?: { text: string, onClick: () => void }) => {
    if ((window as any).showToast) {
        (window as any).showToast({
            type,
            title,
            message,
            duration,
            action
        });
    }
};
export const sendPaymentConfirmation = (data: { id: string; transactionId: string; plan: string; screenshotName: string; amount?: number; paymentMethod?: string }) => {
    // This would likely trigger a Cloud Function
    console.log('Sending payment confirmation:', data);
    return Promise.resolve();
};

export const getRecentNotifications = async (): Promise<Notification[]> => {
    // FIX: Changed to Firebase v9 syntax.
    const q = query(collection(db, 'notifications'), where("isNew", "==", true), limit(5));
    const notificationSnapshot = await getDocs(q);
    return snapshotToArray<Notification>(notificationSnapshot);
};

export const getNotificationsData = async (): Promise<Notification[]> => {
    // FIX: Changed to Firebase v9 syntax.
    const notificationSnapshot = await getDocs(collection(db, 'notifications'));
    return snapshotToArray<Notification>(notificationSnapshot);
};
