import React, { useState, useEffect } from 'react';
import { MOCK_NOTIFICATIONS, Notification, PageProps } from '../types';
import { getNotificationsData, addNotification } from '../services/gasClient';

const NotificationCreator: React.FC<{ onNotificationSent: () => void }> = ({ onNotificationSent }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'System',
        priority: 'Medium',
        icon: 'info',
        iconColor: 'text-blue-500'
    });
    const [sending, setSending] = useState(false);

    const iconOptions = [
        { value: 'info', label: 'Info', color: 'text-blue-500' },
        { value: 'campaign', label: 'Announcement', color: 'text-purple-500' },
        { value: 'warning', label: 'Warning', color: 'text-yellow-500' },
        { value: 'error', label: 'Error', color: 'text-red-500' },
        { value: 'check_circle', label: 'Success', color: 'text-green-500' },
        { value: 'build', label: 'Maintenance', color: 'text-orange-500' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.description) return;
        
        setSending(true);
        try {
            await addNotification({
                id: `admin_${Date.now()}`,
                icon: formData.icon,
                iconColor: formData.iconColor,
                title: formData.title,
                description: formData.description,
                timestamp: new Date().toLocaleString(),
                isNew: true,
                priority: formData.priority as 'Low' | 'Medium' | 'High',
                category: formData.category as any
            });
            
            setFormData({ title: '', description: '', category: 'System', priority: 'Medium', icon: 'info', iconColor: 'text-blue-500' });
            onNotificationSent();
            
            if ((window as any).showToast) {
                (window as any).showToast({
                    type: 'success',
                    title: 'Notification Sent',
                    message: 'Notification has been sent to all users.',
                    duration: 3000
                });
            }
        } catch (error) {
            console.error('Failed to send notification:', error);
            if ((window as any).showToast) {
                (window as any).showToast({
                    type: 'error',
                    title: 'Failed to Send',
                    message: 'Could not send notification. Please try again.',
                    duration: 3000
                });
            }
        } finally {
            setSending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title *</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Notification title"
                        className="w-full p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-2"
                    >
                        <option value="System">System</option>
                        <option value="Update">Update</option>
                        <option value="Alert">Alert</option>
                        <option value="Info">Info</option>
                        <option value="Billing">Billing</option>
                    </select>
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Notification message"
                    className="w-full p-2 h-20"
                    required
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full p-2"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Icon</label>
                    <select
                        value={formData.icon}
                        onChange={(e) => {
                            const selected = iconOptions.find(opt => opt.value === e.target.value);
                            setFormData(prev => ({ 
                                ...prev, 
                                icon: e.target.value,
                                iconColor: selected?.color || 'text-blue-500'
                            }));
                        }}
                        className="w-full p-2"
                    >
                        {iconOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            <button
                type="submit"
                disabled={sending || !formData.title || !formData.description}
                className="btn btn-primary"
            >
                {sending ? 'Sending...' : 'Send Notification'}
            </button>
        </form>
    );
};

const Notifications: React.FC<PageProps> = ({ navigateTo, user }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [showOnlyNew, setShowOnlyNew] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getNotificationsData();
                setNotifications(data);
            } catch (err) {
                console.error("Failed to fetch notifications", err);
                setNotifications(MOCK_NOTIFICATIONS.map(n => ({...n, id: String(Math.random())})));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(notif => ({ ...notif, isNew: false })));
        if ((window as any).showToast) {
            (window as any).showToast({
                type: 'info',
                title: 'All Read',
                message: 'All notifications have been marked as read.',
                duration: 2000
            });
        }
    };

    const filteredNotifications = notifications.filter(notif => {
        if (showOnlyNew && !notif.isNew) return false;
        if (activeFilter === 'All') return true;
        return notif.category === activeFilter;
    });

    const categories = ['All', ...Array.from(new Set(notifications.map(n => n.category)))];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <span className="material-icons-outlined text-blue-600 dark:text-blue-500">notifications</span>
                    Notifications
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-base">Manage your notifications and stay updated.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="card p-6 mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex gap-2 flex-wrap">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveFilter(category)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                            activeFilter === category
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowOnlyNew(!showOnlyNew)}
                                    className={`btn ${showOnlyNew ? 'btn-primary' : 'btn-secondary'} text-sm`}
                                >
                                    {showOnlyNew ? 'Show All' : 'New Only'}
                                </button>
                                <button onClick={markAllAsRead} className="btn btn-secondary text-sm">
                                    Mark All Read
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="p-6 border-b border-inherit">
                            <h2 className="text-xl font-bold">All Notifications</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Your notification history and updates.</p>
                        </div>
                        <div className="divide-y divide-inherit">
                            {loading ? (
                                <div className="p-8 text-center">
                                    <div className="spinner mx-auto"></div>
                                </div>
                            ) : filteredNotifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    <span className="material-icons-outlined text-4xl mb-2 opacity-50">notifications_none</span>
                                    <p>No notifications found.</p>
                                </div>
                            ) : (
                                filteredNotifications.map((notif, index) => (
                                    <div key={notif.id || index} className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors ${
                                        notif.isNew ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                    }`}>
                                        <div className="flex items-start gap-3">
                                            <span className={`material-icons-outlined ${notif.iconColor} text-xl mt-0.5`}>
                                                {notif.icon}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-sm">{notif.title}</h3>
                                                    {notif.isNew && (
                                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                                            New
                                                        </span>
                                                    )}
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                        notif.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                                        notif.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                    }`}>
                                                        {notif.priority}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    {notif.description}
                                                </p>
                                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                                    <span>{notif.timestamp}</span>
                                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-300">
                                                        {notif.category}
                                                    </span>
                                                </div>
                                                {notif.actions && notif.actions.length > 0 && (
                                                    <div className="flex gap-2 mt-3">
                                                        {notif.actions.map((action, actionIndex) => (
                                                            <button
                                                                key={actionIndex}
                                                                onClick={() => {
                                                                    if (navigateTo) navigateTo(action.url);
                                                                }}
                                                                className={`text-xs px-3 py-1 rounded ${
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
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {user?.role === 'Admin' && (
                        <div className="card p-6">
                            <h2 className="text-xl font-bold mb-4">Send Notification</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Send notifications to all users.</p>
                            <NotificationCreator onNotificationSent={() => window.location.reload()} />
                        </div>
                    )}

                    <div className="card p-6">
                        <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Total Notifications</span>
                                <span className="font-semibold">{notifications.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Unread</span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    {notifications.filter(n => n.isNew).length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">High Priority</span>
                                <span className="font-semibold text-red-600 dark:text-red-400">
                                    {notifications.filter(n => n.priority === 'High').length}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Manage your notification settings.</p>
                        <button 
                            onClick={() => navigateTo && navigateTo('settings')}
                            className="btn btn-secondary w-full"
                        >
                            <span className="material-icons-outlined text-sm">settings</span>
                            Go to Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;