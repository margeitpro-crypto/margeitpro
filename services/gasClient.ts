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
    return { 
        totalUsers: users.length, 
        totalMerges: merges.length, 
        activeSubscriptions: users.filter(u => u.plan !== 'Free').length,
        recentMerges: merges.slice(0, 5) 
    };
};
export const getUserDashboardData = async (userEmail: string): Promise<any> => {
    // FIX: Changed to Firebase v9 syntax.
    const q = query(collection(db, 'mergeLogs'), where("user", "==", userEmail), orderBy("timestamp", "desc"));
    const mergeSnapshot = await getDocs(q);
    const recentUserMerges = snapshotToArray<MergeLog>(mergeSnapshot);

    return {
        totalUserMerges: recentUserMerges.length,
        docsGenerated: recentUserMerges.filter(l => l.type === 'Sheet to Docs').length,
        slidesGenerated: recentUserMerges.filter(l => l.type === 'Sheet to Slides').length,
        recentUserMerges: recentUserMerges.slice(0, 5)
    };
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

export const getMergeLogsData = async (): Promise<MergeLog[]> => {
    // FIX: Changed to Firebase v9 syntax.
    const logSnapshot = await getDocs(collection(db, 'mergeLogs'));
    return snapshotToArray<MergeLog>(logSnapshot);
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
