// --- Data Service Interfaces ---

export interface User {
  id?: string; // Firestore document ID
  name: string;
  email: string;
  role: 'Admin' | 'User';
  status: 'Active' | 'Inactive';
  joinDate: string;
  accessPage: string[] | string;
  profilePictureId?: string;
  profilePictureUrl?: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  inactiveDate?: string;
  hasProAccess?: boolean;
}

export interface MergeLog {
  id?: string; // Firestore document ID
  sn: number;
  fileName: string;
  user?: string;
  type: 'Sheet to Slides' | 'Sheet to Docs';
  status: 'Success' | 'Failed';
  date: string;
  sheet?: string;
  timestamp?: string;
  fileUrl?: string;
  operation?: 'Custom' | 'All In One'; // Type of merge operation performed
  templateId?: string; // ID of the template used for the merge
}

export interface AuditLog {
  id?: string; // Firestore document ID
  action: string;
  userEmail: string;
  details: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILURE';
}

export interface Template {
    id: string; // This will be the document ID
    name: string;
    type: 'Sheet' | 'Slides' | 'Docs';
    plan: 'Free' | 'Pro';
    description: string;
    imageUrl?: string;
    imageUrl2?: string;
    sheetUrl?: string;
    imagePath?: string; // Path in Firebase Storage for deletion
}

export interface Notification {
    id?: string; // Firestore document ID
    icon: string;
    iconColor: string;
    title: string;
    description: string;
    timestamp: string;
    isNew: boolean;
    priority?: 'Low' | 'Medium' | 'High';
    category?: 'System' | 'Update' | 'Alert' | 'Info' | 'Merge Status' | 'Billing' | 'User Activity';
    actionUrl?: string;
    actionText?: string;
    actions?: Array<{
        text: string;
        url: string;
        type: 'primary' | 'secondary';
    }>;
}

export interface ToastNotification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number; // in milliseconds
    action?: {
        text: string;
        onClick: () => void;
    };
}

export interface NotificationSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    categories: {
        'Merge Status': boolean;
        'System': boolean;
        'Update': boolean;
        'Alert': boolean;
        'Info': boolean;
        'Billing': boolean;
        'User Activity': boolean;
    };
    priorities: {
        'High': boolean;
        'Medium': boolean;
        'Low': boolean;
    };
}

export interface PaymentHistory {
    id?: string; // Firestore document ID
    gmailId: string; // Gmail ID
    transactionId: string;
    plan: string;
    paymentMethod?: string;
    status: 'Success' | 'Pending' | 'Failed';
    timestamp: string;
}

export interface BillingPlan {
    id: string; // This will be the document ID
    name: string;
    price: number | string;
    pricePeriod?: string;
    features: string[];
    isCurrent: boolean;
    buttonText: string;
    buttonAction?: () => void;
    isActive?: boolean; // For admin control to show/hide plans
    order?: number; // For controlling display order on homepage
    currency?: string; // Currency for the plan (USD, NPR, INR)
}



// --- UI-related types ---

export interface ModalState {
    type: 'confirmation' | 'progress' | 'preview' | null;
    props: any;
}

export interface PageProps {
    setModal: (modal: ModalState) => void;
    theme: string;
    refreshNotifications?: () => Promise<void> | void;
    navigateTo?: (page: string) => void;
    user?: User | null;
}

// --- Mock Data (for populating database or reference) ---

export const MOCK_USERS: Omit<User, 'id'>[] = [
    
    { name: 'Marge It Pro', email: 'margeitpro@gmail.com', role: 'Admin', status: 'Active', joinDate: '2025-01-15', accessPage: 'admin-control-center,system-analytics,form-management,user-dashboard,marge-it,templates,merge-logs,notifications,billing,settings,help', plan: 'Enterprise', hasProAccess: true, profilePictureId: '1FmzVvmkGyYKP0eK1lD1NrURtfmd6aWLl' },
    { name: 'John Doe', email: 'john.doe@example.com', role: 'User', status: 'Active', joinDate: '2023-05-20', accessPage: 'user-dashboard,marge-it,templates,merge-logs,notifications,billing,settings,help', plan: 'Pro', hasProAccess: true, profilePictureId: '1DRoR6plGY-Kj5d2yV_d2A_nUu5eY7k-B' },
    { name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', status: 'Active', joinDate: '2023-08-10', accessPage: 'user-dashboard,marge-it,templates,merge-logs,notifications,billing,settings,help', plan: 'Free' },
    { name: 'Inactive User', email: 'inactive.user@example.com', role: 'User', status: 'Inactive', joinDate: '2023-03-01', inactiveDate: '2024-01-01', accessPage: 'user-dashboard,marge-it,templates,merge-logs', plan: 'Free' },
];

export const MOCK_MERGE_LOGS: Omit<MergeLog, 'id'>[] = [
    { sn: 101, fileName: 'Q1 Report', user: 'john.doe@example.com', type: 'Sheet to Slides', status: 'Success', date: '2024-05-20', timestamp: '2024-05-20 10:30 AM', fileUrl: 'https://docs.google.com/presentation/d/123/edit' },
    { sn: 102, fileName: 'Client Invoices', user: 'jane.smith@example.com', type: 'Sheet to Docs', status: 'Success', date: '2024-05-19', timestamp: '2024-05-19 02:15 PM', fileUrl: 'https://docs.google.com/document/d/456/edit' },
    { sn: 103, fileName: 'Monthly Analytics', user: 'margeitpro@gmail.com', type: 'Sheet to Slides', status: 'Failed', date: '2024-05-18', timestamp: '2024-05-18 09:00 AM' },
];

export const MOCK_AUDIT_LOGS: Omit<AuditLog, 'id'>[] = [
    { action: 'LOGIN_SUCCESS', userEmail: 'john.doe@example.com', details: 'User logged in successfully.', timestamp: new Date().toISOString(), status: 'SUCCESS' },
    { action: 'UPDATE_USER', userEmail: 'margeitpro@gmail.com', details: 'Updated profile for jane.smith@example.com.', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'SUCCESS' },
    { action: 'DELETE_USER', userEmail: 'margeitpro@gmail.com', details: 'Deleted user old.user@example.com.', timestamp: new Date(Date.now() - 86400000).toISOString(), status: 'SUCCESS' },
];

export const MOCK_TEMPLATES: Template[] = [
    { id: 'template_slides_1', name: 'Business Quarterly Review', type: 'Slides', plan: 'Free', description: 'A professional template for quarterly business reviews.', imageUrl: 'https://via.placeholder.com/400x225.png/E2E8F0/4A5568?text=Quarterly+Review', imageUrl2: 'https://via.placeholder.com/400x225.png/E2E8F0/4A5568?text=Quarterly+Review+2', sheetUrl: 'https://docs.google.com/spreadsheets/d/1example/edit' },
    { id: 'template_docs_1', name: 'Project Proposal', type: 'Docs', plan: 'Free', description: 'A clean and modern project proposal document.', imageUrl: 'https://via.placeholder.com/400x225.png/E2E8F0/4A5568?text=Project+Proposal', imageUrl2: 'https://via.placeholder.com/400x225.png/E2E8F0/4A5568?text=Project+Proposal+2', sheetUrl: 'https://docs.google.com/spreadsheets/d/2example/edit' },
    { id: 'template_slides_pro_1', name: 'Investor Pitch Deck', type: 'Slides', plan: 'Pro', description: 'A premium, data-driven pitch deck for investors.', imageUrl: 'https://via.placeholder.com/400x225.png/FEEBC8/975A16?text=Investor+Pitch+Deck', imageUrl2: 'https://via.placeholder.com/400x225.png/FEEBC8/975A16?text=Investor+Pitch+Deck+2', sheetUrl: 'https://docs.google.com/spreadsheets/d/3example/edit' },
];

export const MOCK_NOTIFICATIONS: Omit<Notification, 'id'>[] = [
    { icon: 'check_circle', iconColor: 'text-green-500', title: 'Merge Complete', description: 'Your "Q1 Report" merge was successful.', timestamp: '2 hours ago', isNew: true, priority: 'Medium', category: 'Merge Status', actions: [{ text: 'View Logs', url: '/merge-logs', type: 'primary' }, { text: 'Download Report', url: '/downloads', type: 'secondary' }] },
    { icon: 'error', iconColor: 'text-red-500', title: 'Merge Failed', description: '"Monthly Analytics" failed to merge due to a data error.', timestamp: '1 day ago', isNew: false, priority: 'High', category: 'Merge Status', actions: [{ text: 'Check Details', url: '/merge-logs', type: 'primary' }, { text: 'Retry Merge', url: '/merge-it', type: 'secondary' }] },
    { icon: 'campaign', iconColor: 'text-blue-500', title: 'New Feature', description: 'We\'ve added new chart options to your dashboards.', timestamp: '3 days ago', isNew: false, priority: 'Low', category: 'Update', actionUrl: '/settings', actionText: 'Explore' },
    { icon: 'info', iconColor: 'text-blue-400', title: 'System Maintenance', description: 'Scheduled maintenance will occur tonight from 2-4 AM.', timestamp: '5 hours ago', isNew: true, priority: 'Medium', category: 'System' },
    { icon: 'person_add', iconColor: 'text-purple-500', title: 'New User Registered', description: 'John Doe has joined the platform.', timestamp: '30 minutes ago', isNew: true, priority: 'Low', category: 'User Activity', actions: [{ text: 'View Profile', url: '/admin/users', type: 'primary' }] },
    { icon: 'credit_card', iconColor: 'text-orange-500', title: 'Payment Due', description: 'Your Pro subscription payment is due in 3 days.', timestamp: '2 days ago', isNew: true, priority: 'High', category: 'Billing', actions: [{ text: 'Pay Now', url: '/billing', type: 'primary' }, { text: 'View Invoice', url: '/billing/history', type: 'secondary' }] },
];

export const MOCK_BILLING_PLANS: BillingPlan[] = [
  { id: 'plan_free', name: 'Free', price: 0, pricePeriod: '/ mo', features: ['100 Merges/month', 'Access to Free Templates', 'Standard Support'], isCurrent: false, buttonText: 'Your Current Plan', isActive: true, order: 1, currency: 'USD' },
  { id: 'plan_pro', name: 'Pro', price: 15, pricePeriod: '/ mo', features: ['Unlimited Merges', 'Access to Pro Templates', 'Advanced Analytics', 'Priority Support'], isCurrent: true, buttonText: 'Upgrade to Pro', isActive: true, order: 2, currency: 'USD' },
  { id: 'plan_enterprise', name: 'Enterprise', price: 'Contact Us', features: ['All Pro Features', 'Admin Dashboard', 'User Management', 'Dedicated Support'], isCurrent: false, buttonText: 'Contact Sales', isActive: true, order: 3, currency: 'USD' },
];

export const MOCK_PAYMENT_HISTORY: Omit<PaymentHistory, 'id'>[] = [
    { gmailId: 'john.doe@example.com', transactionId: 'TXN-001', plan: 'Pro', status: 'Success', timestamp: '2024-05-01T10:00:00Z' },
    { gmailId: 'jane.smith@example.com', transactionId: 'TXN-002', plan: 'Pro', status: 'Success', timestamp: '2024-04-01T10:00:00Z' },
];
