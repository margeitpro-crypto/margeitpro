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

export const runSlidesMerge = async (params: GasRequestParams): Promise<GasResponse> => {
    console.log('Running slides merge:', params);

    // Validate parameters
    const validation = validateGasParams(params);
    if (!validation.isValid) {
        return formatGasError(validation.error);
    }

    try {
        const response = await fetch(GAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...params, mode: 'slides', action: 'merge' }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.error) throw new Error(result.error);
        return formatGasSuccess(result);
    } catch (error) {
        console.error('Slides merge error:', error);
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
        const response = await fetch(GAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...params, mode: 'docs', action: 'merge' }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.error) throw new Error(result.error);
        return formatGasSuccess(result);
    } catch (error) {
        console.error('Docs merge error:', error);
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
        const response = await fetch(GAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...params, mode: 'slides', action: 'preview' }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.error) throw new Error(result.error);
        return formatGasSuccess(result);
    } catch (error) {
        console.error('Slides preview error:', error);
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
        const response = await fetch(GAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...params, mode: 'docs', action: 'preview' }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.error) throw new Error(result.error);
        return formatGasSuccess(result);
    } catch (error) {
        console.error('Docs preview error:', error);
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
