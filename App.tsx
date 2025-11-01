import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { db } from './services/firebase';
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { User, Notification as NotificationType, ModalState } from './types';
import { AuthContextProvider, UserAuth } from './context/AuthContext';
import { getRecentNotifications } from './services/gasClient';

// Layout Components
import { Header, Sidebar, adminMenu, generalMenu } from './components/Layout';

// Page Components
import HomePage from './pages/Home';
import LoginPage from './pages/LoginPage';
import AdminControlCenter from './pages/AdminControlCenter';


import UserDashboard from './pages/UserDashboard';
import MargeItPage from './pages/MergeIt';
import Templates from './pages/Templates';
import MergeLogs from './pages/MergeLogs';
import Notifications from './pages/Notifications';
import Billing from './pages/Billing';
import Settings from './pages/Settings';

import NotepadPage from './pages/Notepad';
import FormManagement from './pages/FormManagement';
import SystemAnalytics from './pages/SystemAnalytics';

// Modal Components
import { ConfirmationModal, ProgressModal, PreviewModal } from './components/Modals';
import ToastContainer from './components/ToastContainer';

// Mock data (for notifications, will be replaced by real data)
import { MOCK_NOTIFICATIONS } from './types';
import Help from './pages/Help';
import { useKeyboardShortcuts, globalShortcuts } from './hooks/useKeyboardShortcuts';

const allMenuItems = [...adminMenu.items, ...generalMenu.items];

const AppContent: React.FC = () => {
    const { user: firebaseUser } = UserAuth();

    // --- State Management ---
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [modal, setModal] = useState<ModalState>({ type: null, props: {} });

    // --- Handlers ---
    const navigateTo = useCallback((page: string) => {
        if (window.location.hash !== `#${page}`) {
            window.location.hash = page;
        }
    }, []);

    // --- Effects ---

    // Theme effect
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Authentication and User Data effect
    useEffect(() => {
        const fetchUserData = async () => {
            if (firebaseUser) {
                // Use user.uid as document ID for one-user-one-doc rule
                const userRef = doc(db, 'users', firebaseUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    // User exists, use existing data
                    const userData = { id: userSnap.id, ...userSnap.data() } as User;
                    setUser(userData);
                    // Auto-navigate admin to admin-control-center
                    if (userData.role === 'Admin' && !currentPage) {
                        setTimeout(() => navigateTo('admin-control-center'), 0);
                    }
                } else {
                    // User not found, create new user document with uid as document ID
                    const isAdmin = firebaseUser.email === 'margeitpro@gmail.com';
                    const newUser: Omit<User, 'id'> = {
                        name: firebaseUser.displayName || 'Unknown',
                        email: firebaseUser.email!,
                        role: isAdmin ? 'Admin' : 'User',
                        status: 'Active',
                        joinDate: new Date().toISOString().split('T')[0],
                        accessPage: isAdmin
                            ? 'admin-control-center,system-analytics,form-management,user-dashboard,marge-it,templates,merge-logs,notifications,billing,settings,todo,help'
                            : 'user-dashboard,marge-it,templates,merge-logs,notifications,billing,settings,todo,help',
                        plan: isAdmin ? 'Enterprise' : 'Free',
                        hasProAccess: isAdmin,
                    };
                    await setDoc(userRef, newUser);
                    const userData = { id: userRef.id, ...newUser } as User;
                    setUser(userData);
                    // Auto-navigate admin to admin-control-center
                    if (isAdmin) {
                        setTimeout(() => navigateTo('admin-control-center'), 0);
                    }
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };
        fetchUserData();
    }, [firebaseUser, currentPage, navigateTo]);

    // Routing effect
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            setCurrentPage(hash);
        };
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Initial check
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    // Fetch notifications effect
    const refreshNotifications = useCallback(async () => {
        try {
            const data = await getRecentNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            // Fallback to mock data if Firebase fails
            setNotifications(MOCK_NOTIFICATIONS.map(n => ({...n, id: String(Math.random())})));
        }
    }, []);

    useEffect(() => {
        if (user) {
            refreshNotifications();
        }
    }, [user, refreshNotifications]);

    const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');

    // Keyboard shortcuts
    useKeyboardShortcuts(globalShortcuts(navigateTo, toggleTheme));

    // --- Memoized Values ---
    const currentPageLabel = useMemo(() => {
        return allMenuItems.find(item => item.id === currentPage)?.label || 'Dashboard';
    }, [currentPage]);
    
    const accessiblePages = useMemo(() => {
        if (!user?.accessPage) return [];
        if (typeof user.accessPage === 'string') {
            return user.accessPage.split(',').map(p => p.trim());
        }
        return user.accessPage;
    }, [user]);

    const pageToRender = useMemo(() => {
        if (!user) return null;

        if (currentPage && !accessiblePages.includes(currentPage)) {
            const defaultPage = accessiblePages.includes('admin-control-center') ? 'admin-control-center' : 'user-dashboard';
            setTimeout(() => navigateTo(defaultPage), 0);
            return null;
        }
        
        const pageProps: import('./types').PageProps = { setModal, theme, refreshNotifications, navigateTo, user };

        switch (currentPage) {
            case 'admin-control-center': return <AdminControlCenter {...pageProps} />;

            case 'system-analytics': return <SystemAnalytics {...pageProps} />;
            case 'form-management': return <FormManagement {...pageProps} />;
            case 'user-dashboard': return <UserDashboard {...pageProps} />;
            case 'marge-it': return <MargeItPage {...pageProps} />;
            case 'templates': return <Templates {...pageProps} />;
            case 'merge-logs': return <MergeLogs {...pageProps} />;
            case 'notifications': return <Notifications {...pageProps} />;
            case 'billing': return <Billing {...pageProps} />;
            case 'settings': return <Settings {...pageProps} />;
            case 'todo': return <NotepadPage {...pageProps} />;
            case 'help': return <Help {...pageProps} />;
            default:
                const defaultPage = accessiblePages.includes('admin-control-center') ? 'admin-control-center' : 'user-dashboard';
                 if (currentPage !== defaultPage) {
                    setTimeout(() => navigateTo(defaultPage), 0);
                 }
                return null;
        }
    }, [currentPage, accessiblePages, theme, user, navigateTo, setModal, refreshNotifications]);

    // --- Render Logic ---

    if (loading) {
        return <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-slate-900"><div className="spinner"></div></div>;
    }

    if (!user) {
        if (currentPage === 'login') {
            return <LoginPage />;
        }
        if (currentPage) {
            window.location.hash = 'login';
        }
        return <HomePage />;
    }
    
    return (
        <div className={`app-layout theme-${theme} flex h-screen overflow-hidden`}>
            <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'} bg-black/30`} onClick={() => setSidebarOpen(false)}></div>
            <div className={`fixed lg:relative top-0 left-0 h-full z-50 lg:z-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <Sidebar user={user} activePage={currentPage} navigateTo={navigateTo} />
            </div>
            <div className="flex flex-col flex-1 h-screen overflow-hidden lg:ml-0">
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    toggleTheme={toggleTheme}
                    theme={theme}
                    user={user}
                    navigateTo={navigateTo}
                    currentPageLabel={currentPageLabel}
                    notifications={notifications}
                />
                <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-light-background dark:bg-dark-background">
                    {pageToRender}
                </main>
            </div>

            {/* Modal Renderer */}
            {modal.type && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
                    {modal.type === 'confirmation' && <ConfirmationModal {...modal.props} onCancel={() => setModal({ type: null, props: {} })} />}
                    {modal.type === 'progress' && <ProgressModal {...modal.props} />}
                    {modal.type === 'preview' && <PreviewModal {...modal.props} />}
                </div>
            )}

            {/* Toast Notifications */}
            <ToastContainer />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthContextProvider>
            <AppContent />
        </AuthContextProvider>
    );
};

export default App;
