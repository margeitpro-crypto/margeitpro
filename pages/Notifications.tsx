
import React, { useState, useEffect } from 'react';
import { MOCK_NOTIFICATIONS, Notification, PageProps } from '../types';
import { getNotificationsData } from '../services/gasClient';

const ToggleSwitch: React.FC<{ label: string, description: string, defaultChecked?: boolean }> = ({ label, description, defaultChecked=false }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);
    return (
        <div className="flex justify-between items-center">
            <div>
                <h3 className="font-semibold">{label}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
        </div>
    );
};

const Notifications: React.FC<PageProps> = ({ navigateTo }) => {
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
                // Fallback to mock data if Firebase fails
                setNotifications(MOCK_NOTIFICATIONS.map(n => ({...n, id: String(Math.random())})));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(notif => ({ ...notif, isNew: false })));

        // Show toast notification
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

    const filterOptions = ['All', 'Merge Status', 'System', 'Update', 'Alert', 'Info', 'Billing', 'User Activity'];
    
    return (
        <div className="max-w-7xl mx-auto">
             <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <span className="material-icons-outlined text-blue-600 dark:text-blue-500">notifications</span>Notifications
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-base">View and manage your recent notifications and settings.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2">
                    <div className="card p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <h2 className="text-xl font-bold">Notification History</h2>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={markAllAsRead}
                                    className="btn btn-secondary text-sm"
                                    disabled={!notifications.some(n => n.isNew)}
                                >
                                    Mark All as Read
                                </button>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={showOnlyNew}
                                        onChange={(e) => setShowOnlyNew(e.target.checked)}
                                        className="rounded"
                                    />
                                    Show only new
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {filterOptions.map(option => (
                                <button
                                    key={option}
                                    onClick={() => setActiveFilter(option)}
                                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                        activeFilter === option
                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        {loading ? (
                            <div className="flex justify-center items-center h-40"><div className="spinner"></div></div>
                        ) : (
                            <div className="space-y-4">
                                {notifications.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">No notifications yet.</p>
                                ) : filteredNotifications.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">
                                        {activeFilter === 'All' && showOnlyNew ? 'No new notifications.' :
                                         activeFilter === 'All' ? 'No notifications yet.' :
                                         `No ${activeFilter.toLowerCase()} notifications${showOnlyNew ? ' (new only)' : ''}.`}
                                    </p>
                                ) : (
                                    filteredNotifications.slice().reverse().map((notif, index) => (
                                        <div key={index} className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg border border-inherit">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-start gap-3">
                                                    <span className={`material-icons-outlined ${notif.iconColor} mt-1`}>{notif.icon}</span>
                                                    <div className="flex-grow">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-semibold">{notif.title}</h3>
                                                            {notif.priority && (
                                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                                    notif.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                                                    notif.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                                                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                                }`}>
                                                                    {notif.priority}
                                                                </span>
                                                            )}
                                                            {notif.category && (
                                                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 font-medium">
                                                                    {notif.category}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{notif.description}</p>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <p className="text-xs text-gray-400 dark:text-gray-500">{notif.timestamp}</p>
                                                            <div className="flex gap-2">
                                                                {notif.actions && notif.actions.map((action, actionIndex) => (
                                                                    <button
                                                                        key={actionIndex}
                                                                        onClick={() => navigateTo && navigateTo(action.url)}
                                                                        className={`text-xs px-2 py-1 rounded font-medium ${
                                                                            action.type === 'primary'
                                                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                                                        }`}
                                                                    >
                                                                        {action.text}
                                                                    </button>
                                                                ))}
                                                                {notif.actionUrl && notif.actionText && !notif.actions && (
                                                                    <a
                                                                        href={notif.actionUrl}
                                                                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
                                                                    >
                                                                        {notif.actionText}
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {notif.isNew && <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300 ml-2">New</span>}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="card p-6 h-fit">
                    <h2 className="text-xl font-bold mb-1">Notification Settings</h2>
                    <p className="text-base text-gray-500 dark:text-gray-400 mb-6">Control how you receive notifications.</p>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-3">Delivery Methods</h3>
                            <div className="space-y-3">
                                <ToggleSwitch label="Email Notifications" description="Receive notifications via email." defaultChecked />
                                <ToggleSwitch label="Push Notifications" description="Receive browser push notifications." />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-3">Categories</h3>
                            <div className="space-y-3">
                                <ToggleSwitch label="Merge Status" description="Success and failure notifications." defaultChecked />
                                <ToggleSwitch label="System" description="System maintenance and updates." defaultChecked />
                                <ToggleSwitch label="Billing" description="Payment and subscription alerts." defaultChecked />
                                <ToggleSwitch label="User Activity" description="New user registrations and activity." />
                                <ToggleSwitch label="Updates" description="New features and improvements." />
                                <ToggleSwitch label="Alerts" description="Important alerts and warnings." defaultChecked />
                                <ToggleSwitch label="Info" description="General information messages." />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-3">Priority Levels</h3>
                            <div className="space-y-3">
                                <ToggleSwitch label="High Priority" description="Critical alerts and failures." defaultChecked />
                                <ToggleSwitch label="Medium Priority" description="Important updates and changes." defaultChecked />
                                <ToggleSwitch label="Low Priority" description="General notifications and info." />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;