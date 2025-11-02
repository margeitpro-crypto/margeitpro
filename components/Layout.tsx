import React, { useState, useEffect, useRef } from 'react';
import { User, Notification } from '../types';
import { auth } from '../services/firebase';
// FIX: Removed incorrect Firebase v9 'signOut' import. The v8 equivalent is a method on the auth object.

// --- Types ---
interface NavItem {
    id: string;
    label: string;
    icon: string;
    color: string;
}
interface NavSection {
    title: string;
    items: NavItem[];
    requiredPages: string[];
}
interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    toggleTheme: () => void;
    theme: string;
    user: User;
    navigateTo: (page: string) => void;
    currentPageLabel: string;
    notifications: Notification[];
}
interface SidebarProps {
    user: User;
    activePage: string;
    navigateTo: (page: string) => void;
}

// --- Constants ---
export const adminMenu: NavSection = {
    title: "Administration",
    requiredPages: ['admin-control-center', 'form-management', 'system-analytics'],
    items: [
        { id: 'admin-control-center', label: 'Admin Control', icon: 'admin_panel_settings', color: 'text-purple-500 dark:text-purple-400' },
        { id: 'system-analytics', label: 'System Analytics', icon: 'desktop_windows', color: 'text-sky-500 dark:text-sky-400' },

        { id: 'form-management', label: 'Form Management', icon: 'dynamic_form', color: 'text-rose-500 dark:text-rose-400' },

    ]
};
export const generalMenu: NavSection = {
    title: "General",
    requiredPages: [],
    items: [
        { id: 'user-dashboard', label: 'Dashboard', icon: 'bar_chart', color: 'text-green-500 dark:text-green-400' },
        { id: 'marge-it', label: 'Marge It', icon: 'link', color: 'text-cyan-500 dark:text-cyan-400' },
        { id: 'templates', label: 'Templates', icon: 'description', color: 'text-indigo-500 dark:text-indigo-400' },
        { id: 'merge-logs', label: 'Merge Logs', icon: 'history_toggle_off', color: 'text-orange-500 dark:text-orange-400' },
        { id: 'notifications', label: 'Notifications', icon: 'notifications', color: 'text-red-500 dark:text-red-400' },
        { id: 'billing', label: 'Billing', icon: 'credit_card', color: 'text-pink-500 dark:text-pink-400' },
        { id: 'settings', label: 'Settings', icon: 'settings', color: 'text-gray-500 dark:text-gray-400' },
        { id: 'help', label: 'Help', icon: 'help', color: 'text-teal-500 dark:text-teal-400' },
 
    ]
};

// --- Helper Functions ---
const getAccessiblePages = (userAccessPage: string[] | string): string[] => {
    if (typeof userAccessPage === 'string') {
        return userAccessPage.split(',').map(p => p.trim());
    }
    return userAccessPage || [];
};

const hasAccess = (accessiblePages: string[], requiredPages: string[]) => {
    if (requiredPages.length === 0) return true;
    return requiredPages.some(page => accessiblePages.includes(page));
};

// --- Components ---

interface SocialLinks {
    whatsapp?: string;
    youtube?: string;
    facebook?: string;
}

const SocialIcons: React.FC<{ className?: string; links?: SocialLinks }> = ({ className, links = {} }) => (
    <div className={`flex items-center gap-2 ${className}`}>
        {links.whatsapp && (
            <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="material-icons-outlined cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-green-500 dark:text-green-400" aria-label="WhatsApp">chat</a>
        )}
        {links.youtube && (
            <a href={links.youtube} target="_blank" rel="noopener noreferrer" className="material-icons-outlined cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-red-500 dark:text-red-400" aria-label="YouTube">play_circle</a>
        )}
        {links.facebook && (
            <a href={links.facebook} target="_blank" rel="noopener noreferrer" className="material-icons-outlined cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-blue-600 dark:text-blue-500" aria-label="Facebook">facebook</a>
        )}
    </div>
);

const MenuItem: React.FC<{ item: NavItem; isActive: boolean; onClick: () => void }> = ({ item, isActive, onClick }) => (
    <div
        className={`menu-item flex items-center gap-3 px-3 py-1.5 rounded-md cursor-pointer ${isActive ? 'menu-active' : ''}`}
        onClick={onClick}
    >
        <span className={`material-icons-outlined ${isActive ? '' : item.color}`}>{item.icon}</span>
        {item.label}
    </div>
);

export const Sidebar: React.FC<SidebarProps> = ({ user, activePage, navigateTo }) => {
    const accessiblePages = getAccessiblePages(user.accessPage);

    return (
        <aside className="sidebar flex flex-col h-screen w-64 flex-shrink-0">
            <div className="px-6 h-16 text-xl font-bold flex items-center gap-2.5 border-b border-inherit flex-shrink-0">
                <span className="material-icons-outlined text-3xl text-primary">apps</span>
                <span className="tracking-tight">MargeitPro</span>
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-4">
                    {hasAccess(accessiblePages, adminMenu.requiredPages) && (
                        <div className="mb-5">
                            <div className="px-3 mb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{adminMenu.title}</div>
                            <div className="space-y-0.5">
                                {adminMenu.items.filter(item => accessiblePages.includes(item.id)).map(item => (
                                    <MenuItem key={item.id} item={item} isActive={activePage === item.id} onClick={() => navigateTo(item.id)} />
                                ))}
                            </div>
                        </div>
                    )}
                     <div>
                        <div className="px-3 mb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{generalMenu.title}</div>
                        <div className="space-y-0.5">
                            {generalMenu.items.filter(item => accessiblePages.includes(item.id)).map(item => (
                                <MenuItem key={item.id} item={item} isActive={activePage === item.id} onClick={() => navigateTo(item.id)} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 border-t border-inherit flex-shrink-0">
                <div className="text-center text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Contact Support</div>
                <SocialIcons className="justify-center" links={{ whatsapp: 'https://wa.me/9827792360', youtube: 'https://youtube.com/@margeitpro', facebook: 'https://facebook.com/margeitpro' }} />
            </div>
        </aside>
    );
};

export const Header: React.FC<HeaderProps> = ({ setSidebarOpen, toggleTheme, theme, user, navigateTo, currentPageLabel, notifications }) => {
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        try {
            // FIX: Changed to Firebase v8 syntax for signing out.
            await auth.signOut();
            // App component will handle redirecting to LandingPage
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="h-16 px-6 flex justify-between items-center flex-shrink-0 bg-surface border-b border-fb">
            <div className="flex items-center gap-3">
                <span onClick={() => setSidebarOpen(prev => !prev)} className="material-icons-outlined cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full lg:hidden">menu</span>
                <h1 className="text-xl font-bold" style={{ color: 'var(--fb-text-primary)' }}>{currentPageLabel}</h1>
            </div>

            <div className="flex items-center gap-2">
                <SocialIcons className="hidden md:flex" links={{ whatsapp: 'https://wa.me/9827792360', youtube: 'https://youtube.com/@margeitpro', facebook: 'https://facebook.com/margeitpro' }} />
                <div className="hidden md:block h-6 w-px bg-gray-200 dark:bg-slate-700 mx-2" />

                <div className="relative" ref={notifRef}>
                    <span onClick={() => setNotifOpen(p => !p)} className="material-icons-outlined cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-yellow-500 dark:text-yellow-400 relative transition-all duration-200 hover:scale-110">
                        notifications
                        {notifications.filter(n => n.isNew).length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center font-bold notification-badge animate-pulse">
                                {notifications.filter(n => n.isNew).length}
                            </span>
                        )}
                    </span>
                    <div className={`card absolute right-0 mt-3 w-80 rounded-xl z-50 transition-all duration-300 ${notifOpen ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2 pointer-events-none'}`}>
                        <div className="p-3 border-b border-inherit font-semibold">Notifications</div>
                        <ul className="max-h-64 overflow-y-auto">
                            {[...notifications]
                                .sort((a, b) => {
                                    // New notifications first, then by timestamp (newest first)
                                    if (a.isNew && !b.isNew) return -1;
                                    if (!a.isNew && b.isNew) return 1;
                                    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                                })
                                .slice(0, 5)
                                .map((notif, index) => (
                                <li key={index} className="p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                    <div className="flex items-start gap-3">
                                        <span className={`material-icons-outlined ${notif.iconColor} text-sm mt-0.5`}>{notif.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-sm font-medium truncate">{notif.title}</p>
                                                {notif.isNew && <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">New</span>}
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{notif.description}</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notif.timestamp}</p>
                                            {notif.actions && notif.actions.length > 0 && (
                                                <div className="flex gap-1 mt-2">
                                                    {notif.actions.slice(0, 2).map((action, actionIndex) => (
                                                        <button
                                                            key={actionIndex}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setNotifOpen(false);
                                                                navigateTo(action.url);
                                                            }}
                                                            className={`text-xs px-2 py-1 rounded ${
                                                                action.type === 'primary'
                                                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                                            }`}
                                                        >
                                                            {action.text}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {notifications.length === 0 && (
                                <li className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">
                                    No notifications
                                </li>
                            )}
                        </ul>
                        <div onClick={() => { setNotifOpen(false); navigateTo('notifications'); }} className="p-2 text-center text-blue-600 dark:text-blue-400 text-sm border-t border-inherit cursor-pointer hover:underline">View All Notifications</div>
                    </div>
                </div>

                <span onClick={toggleTheme} className="material-icons-outlined cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-purple-500 dark:text-purple-400">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>

                <div className="relative" ref={profileRef}>
                    {user.profilePictureUrl ? (
                        <img
                            src={user.profilePictureUrl}
                            onClick={() => setProfileOpen(p => !p)}
                            className="w-8 h-8 rounded-full object-cover cursor-pointer p-0.5 hover:bg-gray-100 dark:hover:bg-slate-800"
                            alt="Profile"
                        />
                    ) : user.profilePictureId ? (
                        <img
                            src={`https://lh3.googleusercontent.com/d/${user.profilePictureId}`}
                            onClick={() => setProfileOpen(p => !p)}
                            className="w-8 h-8 rounded-full object-cover cursor-pointer p-0.5 hover:bg-gray-100 dark:hover:bg-slate-800"
                            alt="Profile"
                        />
                    ) : (
                        <span onClick={() => setProfileOpen(p => !p)} className="material-icons-outlined cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-sky-500 dark:text-sky-400">person</span>
                    )}
                     <div className={`card absolute right-0 mt-3 w-52 rounded-xl z-50 ${profileOpen ? '' : 'hidden'}`}>
                        <div className="p-3 border-b border-inherit">
                            <div className="font-semibold">{user.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                        </div>
                        <ul>
                            <li onClick={() => { setProfileOpen(false); navigateTo('settings'); }} className="hover:bg-gray-100 dark:hover:bg-slate-800 px-4 py-2 cursor-pointer flex items-center gap-2.5">
                                <span className="material-icons-outlined text-base">settings</span> Settings
                            </li>
                            <li onClick={handleLogout} className="hover:bg-gray-100 dark:hover:bg-slate-800 px-4 py-2 cursor-pointer flex items-center gap-2.5">
                                <span className="material-icons-outlined text-base">logout</span> Logout
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
};
