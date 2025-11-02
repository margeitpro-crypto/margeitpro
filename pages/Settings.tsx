import React, { useState, useEffect, useRef } from 'react';
import { PageProps, User } from '../types';
import { uploadFile, updateUserByUser } from '../services/gasClient';
import { adminMenu, generalMenu } from '../components/Layout';
import ThemeSettings from '../components/ThemeSettings';

const allPagesMap = new Map([...adminMenu.items, ...generalMenu.items].map(item => [item.id, item.label]));

type SettingsTab = 'profile' | 'security' | 'notifications' | 'preferences' | 'billing' | 'data';

const Settings: React.FC<PageProps> = ({ setModal, user }) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

    const [notificationSettings, setNotificationSettings] = useState({
        mergeCompletion: true,
        systemUpdates: true,
        marketingEmails: false,
        errorAlerts: true,
        weeklyDigest: true,
        billingAlerts: true
    });
    const [preferences, setPreferences] = useState({
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
        autoSave: true,
        compactMode: false
    });


    // The user object is now passed directly via props.
    // No need for local state for the user, loading, or error.
    const currentUser = user;



    const planDetails: { [key in User['plan']]: { color: string } } = {
        Free: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
        Pro: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
        Enterprise: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' }
    };

    const handleDeleteAccount = () => {
         setModal({
            type: 'confirmation',
            props: {
                title: 'Delete Account',
                message: 'Are you absolutely sure you want to delete your account? All your data will be permanently lost.',
                confirmColor: 'btn-danger',
                onConfirm: () => {
                    alert('Account deleted (mock).');
                    setModal({ type: null, props: {} });
                }
            }
        });
    }
    
    const getUserAvatar = (user: User) => {
        if (user.profilePictureUrl) {
            return user.profilePictureUrl;
        }
        if (user.profilePictureId) {
            return `https://lh3.googleusercontent.com/d/${user.profilePictureId}`;
        }
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`;
    };
    
    if (!currentUser) {
        return (
            <div className="card p-8 text-center text-red-500">
                Could not load your user profile. Please try refreshing the page.
            </div>
        );
    }
    
    const userAccessPages = Array.isArray(currentUser.accessPage)
        ? currentUser.accessPage
        : (currentUser.accessPage || '').split(',').map(p => p.trim()).filter(Boolean);

    const tabs: { id: SettingsTab; label: string; icon: string }[] = [
        { id: 'profile', label: 'Profile', icon: 'person' },
        { id: 'security', label: 'Security', icon: 'security' },
        { id: 'notifications', label: 'Notifications', icon: 'notifications' },
        { id: 'preferences', label: 'Preferences', icon: 'tune' },
        { id: 'billing', label: 'Billing', icon: 'credit_card' },
        { id: 'data', label: 'Data & Privacy', icon: 'privacy_tip' }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return renderProfileTab();
            case 'security':
                return renderSecurityTab();
            case 'notifications':
                return renderNotificationsTab();
            case 'preferences':
                return renderPreferencesTab();
            case 'billing':
                return renderBillingTab();
            case 'data':
                return renderDataTab();

            default:
                return renderProfileTab();
        }
    };

    const renderProfileTab = () => (
        <div className="space-y-6">
            <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4 text-fb-text dark:text-fb-text-dark">Profile Information</h3>
                <div className="flex items-center gap-6 mb-6">
                    <div>
                        <img 
                            src={getUserAvatar(currentUser)} 
                            className="w-20 h-20 rounded-full object-cover" 
                            alt={currentUser.name}
                        />
                        <p className="text-xs text-fb-secondary dark:text-fb-secondary-dark mt-2 text-center">Gmail Profile</p>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-fb-text dark:text-fb-text-dark">{currentUser.name}</h4>
                        <p className="text-fb-secondary dark:text-fb-secondary-dark">{currentUser.email}</p>
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mt-2 ${currentUser.role === 'Admin' ? 'bg-fb-primary/10 text-fb-primary' : 'bg-fb-secondary/10 text-fb-secondary dark:text-fb-secondary-dark'}`}>
                            {currentUser.role}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-fb-text dark:text-fb-text-dark mb-2">Full Name</label>
                        <input type="text" defaultValue={currentUser.name} className="w-full p-3 border border-fb-border dark:border-fb-border-dark rounded-lg bg-white dark:bg-fb-surface text-fb-text dark:text-fb-text-dark" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-fb-text dark:text-fb-text-dark mb-2">Email</label>
                        <input type="email" defaultValue={currentUser.email} disabled className="w-full p-3 border border-fb-border dark:border-fb-border-dark rounded-lg bg-fb-light dark:bg-fb-dark text-fb-secondary dark:text-fb-secondary-dark" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-fb-text dark:text-fb-text-dark mb-2">Phone Number</label>
                        <input type="tel" placeholder="+1 (555) 123-4567" className="w-full p-3 border border-fb-border dark:border-fb-border-dark rounded-lg bg-white dark:bg-fb-surface text-fb-text dark:text-fb-text-dark" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-fb-text dark:text-fb-text-dark mb-2">Job Title</label>
                        <input type="text" placeholder="Software Engineer" className="w-full p-3 border border-fb-border dark:border-fb-border-dark rounded-lg bg-white dark:bg-fb-surface text-fb-text dark:text-fb-text-dark" />
                    </div>
                </div>
                <div className="mt-6">
                    <label className="block text-sm font-medium text-fb-text dark:text-fb-text-dark mb-2">Bio</label>
                    <textarea rows={3} placeholder="Tell us about yourself..." className="w-full p-3 border border-fb-border dark:border-fb-border-dark rounded-lg bg-white dark:bg-fb-surface text-fb-text dark:text-fb-text-dark"></textarea>
                </div>
                <div className="flex justify-end mt-6">
                    <button className="btn btn-primary">Save Changes</button>
                </div>
            </div>
            
            <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4 text-fb-text dark:text-fb-text-dark">Account Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-fb-light dark:bg-fb-dark rounded-lg">
                        <div className="text-2xl font-bold text-fb-primary">{currentUser.plan}</div>
                        <div className="text-sm text-fb-secondary dark:text-fb-secondary-dark">Current Plan</div>
                    </div>
                    <div className="text-center p-4 bg-fb-light dark:bg-fb-dark rounded-lg">
                        <div className="text-2xl font-bold text-green-500">{currentUser.status}</div>
                        <div className="text-sm text-fb-secondary dark:text-fb-secondary-dark">Account Status</div>
                    </div>
                    <div className="text-center p-4 bg-fb-light dark:bg-fb-dark rounded-lg">
                        <div className="text-2xl font-bold text-fb-text dark:text-fb-text-dark">{currentUser.joinDate}</div>
                        <div className="text-sm text-fb-secondary dark:text-fb-secondary-dark">Member Since</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSecurityTab = () => (
        <div className="space-y-6">
            <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4 text-fb-text dark:text-fb-text-dark">Account Security</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-fb-light dark:bg-fb-dark rounded-lg">
                        <div className="flex items-center gap-3">
                            <span className="material-icons-outlined text-green-500">verified_user</span>
                            <div>
                                <div className="font-medium text-fb-text dark:text-fb-text-dark">Google Authentication</div>
                                <div className="text-sm text-fb-secondary dark:text-fb-secondary-dark">Your account is secured by Google</div>
                            </div>
                        </div>
                        <span className="text-green-500 text-sm font-medium">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-fb-light dark:bg-fb-dark rounded-lg">
                        <div className="flex items-center gap-3">
                            <span className="material-icons-outlined text-yellow-500">security</span>
                            <div>
                                <div className="font-medium text-fb-text dark:text-fb-text-dark">Two-Factor Authentication</div>
                                <div className="text-sm text-fb-secondary dark:text-fb-secondary-dark">Add an extra layer of security</div>
                            </div>
                        </div>
                        <button className="btn btn-secondary btn-sm">Enable</button>
                    </div>
                </div>
                <div className="mt-6">
                    <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        Manage Google Security <span className="material-icons-outlined text-base ml-2">open_in_new</span>
                    </a>
                </div>
            </div>
            
            <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4 text-fb-text dark:text-fb-text-dark">Login Activity</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-fb-border dark:border-fb-border-dark">
                                <th className="text-left py-3 text-fb-text dark:text-fb-text-dark">Device</th>
                                <th className="text-left py-3 text-fb-text dark:text-fb-text-dark">Location</th>
                                <th className="text-left py-3 text-fb-text dark:text-fb-text-dark">Date</th>
                                <th className="text-left py-3 text-fb-text dark:text-fb-text-dark">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-fb-border dark:border-fb-border-dark">
                                <td className="py-3 text-fb-text dark:text-fb-text-dark">Chrome on Windows</td>
                                <td className="py-3 text-fb-secondary dark:text-fb-secondary-dark">New York, US</td>
                                <td className="py-3 text-fb-secondary dark:text-fb-secondary-dark">Today, 2:30 PM</td>
                                <td className="py-3"><span className="text-green-500 text-sm">Current</span></td>
                            </tr>
                            <tr className="border-b border-fb-border dark:border-fb-border-dark">
                                <td className="py-3 text-fb-text dark:text-fb-text-dark">Safari on iPhone</td>
                                <td className="py-3 text-fb-secondary dark:text-fb-secondary-dark">New York, US</td>
                                <td className="py-3 text-fb-secondary dark:text-fb-secondary-dark">Yesterday, 8:15 AM</td>
                                <td className="py-3"><span className="text-fb-secondary dark:text-fb-secondary-dark text-sm">Ended</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderNotificationsTab = () => (
        <div className="space-y-6">
            <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4 text-fb-text dark:text-fb-text-dark">Email Notifications</h3>
                <p className="text-sm text-fb-secondary dark:text-fb-secondary-dark mb-6">Choose which notifications you'd like to receive. Each category has its own color for easy identification.</p>
                <div className="space-y-2">
                    {Object.entries({
                        mergeCompletion: { label: 'Merge Completion', desc: 'Get notified when your merges complete', color: 'checkbox-green' },
                        systemUpdates: { label: 'System Updates', desc: 'Receive notifications about system updates', color: '' },
                        marketingEmails: { label: 'Marketing Emails', desc: 'Receive tips, tutorials, and product updates', color: 'checkbox-purple' },
                        errorAlerts: { label: 'Error Alerts', desc: 'Get notified when operations fail', color: 'checkbox-red' },
                        weeklyDigest: { label: 'Weekly Digest', desc: 'Weekly summary of your activity', color: 'checkbox-orange' },
                        billingAlerts: { label: 'Billing Alerts', desc: 'Payment reminders and billing updates', color: 'checkbox-pink' }
                    }).map(([key, { label, desc, color }]) => (
                        <div key={key} className="flex items-center justify-between p-3 rounded-lg hover:bg-fb-light dark:hover:bg-fb-dark transition-colors">
                            <div className="flex items-center gap-3">
                                <input 
                                    type="checkbox" 
                                    checked={notificationSettings[key as keyof typeof notificationSettings]}
                                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                                    className={color}
                                />
                                <div>
                                    <div className="font-medium text-fb-text dark:text-fb-text-dark">{label}</div>
                                    <div className="text-sm text-fb-secondary dark:text-fb-secondary-dark">{desc}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderPreferencesTab = () => (
        <div className="space-y-6">
            <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4 text-fb-text dark:text-fb-text-dark">General Preferences</h3>
                <p className="text-sm text-fb-secondary dark:text-fb-secondary-dark mb-6">Customize your experience with colorful checkboxes and personalized settings.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-fb-text dark:text-fb-text-dark mb-2">Language</label>
                        <select value={preferences.language} onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))} className="w-full p-3 border border-fb-border dark:border-fb-border-dark rounded-lg bg-white dark:bg-fb-surface text-fb-text dark:text-fb-text-dark">
                            <option value="en">English</option>
                            <option value="ne">नेपाली</option>
                            <option value="hi">हिन्दी</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-fb-text dark:text-fb-text-dark mb-2">Timezone</label>
                        <select value={preferences.timezone} onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))} className="w-full p-3 border border-fb-border dark:border-fb-border-dark rounded-lg bg-white dark:bg-fb-surface text-fb-text dark:text-fb-text-dark">
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">Eastern Time</option>
                            <option value="Asia/Kathmandu">Nepal Time</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-fb-text dark:text-fb-text-dark mb-2">Date Format</label>
                        <select value={preferences.dateFormat} onChange={(e) => setPreferences(prev => ({ ...prev, dateFormat: e.target.value }))} className="w-full p-3 border border-fb-border dark:border-fb-border-dark rounded-lg bg-white dark:bg-fb-surface text-fb-text dark:text-fb-text-dark">
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6">
                    <h4 className="text-md font-semibold mb-4 text-fb-text dark:text-fb-text-dark">Interface Options</h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-fb-light dark:hover:bg-fb-dark transition-colors">
                            <input 
                                type="checkbox" 
                                checked={preferences.autoSave}
                                onChange={(e) => setPreferences(prev => ({ ...prev, autoSave: e.target.checked }))}
                                className="checkbox-green"
                            />
                            <div>
                                <div className="font-medium text-fb-text dark:text-fb-text-dark">Auto-save</div>
                                <div className="text-sm text-fb-secondary dark:text-fb-secondary-dark">Automatically save your work</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-fb-light dark:hover:bg-fb-dark transition-colors">
                            <input 
                                type="checkbox" 
                                checked={preferences.compactMode}
                                onChange={(e) => setPreferences(prev => ({ ...prev, compactMode: e.target.checked }))}
                                className="checkbox-purple"
                            />
                            <div>
                                <div className="font-medium text-fb-text dark:text-fb-text-dark">Compact Mode</div>
                                <div className="text-sm text-fb-secondary dark:text-fb-secondary-dark">Use a more compact interface</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            

        </div>
    );

    const renderBillingTab = () => (
        <div className="space-y-6">
            <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4 text-fb-text dark:text-fb-text-dark">Current Plan</h3>
                <div className="flex items-center justify-between p-4 bg-fb-light dark:bg-fb-dark rounded-lg">
                    <div>
                        <div className="text-xl font-bold text-fb-text dark:text-fb-text-dark">{currentUser.plan} Plan</div>
                        <div className="text-fb-secondary dark:text-fb-secondary-dark">Active since {currentUser.joinDate}</div>
                    </div>
                    <button className="btn btn-primary">Upgrade Plan</button>
                </div>
            </div>
            
            <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4 text-fb-text dark:text-fb-text-dark">Usage Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-fb-light dark:bg-fb-dark rounded-lg">
                        <div className="text-2xl font-bold text-fb-primary">47</div>
                        <div className="text-sm text-fb-secondary dark:text-fb-secondary-dark">Merges This Month</div>
                    </div>
                    <div className="text-center p-4 bg-fb-light dark:bg-fb-dark rounded-lg">
                        <div className="text-2xl font-bold text-fb-primary">2.3 GB</div>
                        <div className="text-sm text-fb-secondary dark:text-fb-secondary-dark">Storage Used</div>
                    </div>
                    <div className="text-center p-4 bg-fb-light dark:bg-fb-dark rounded-lg">
                        <div className="text-2xl font-bold text-fb-primary">12</div>
                        <div className="text-sm text-fb-secondary dark:text-fb-secondary-dark">Templates Created</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDataTab = () => (
        <div className="space-y-6">
            <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4 text-fb-text dark:text-fb-text-dark">Data Management</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-fb-light dark:bg-fb-dark rounded-lg">
                        <div>
                            <div className="font-medium text-fb-text dark:text-fb-text-dark">Export Data</div>
                            <div className="text-sm text-fb-secondary dark:text-fb-secondary-dark">Download all your data</div>
                        </div>
                        <button className="btn btn-secondary">Export</button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-fb-light dark:bg-fb-dark rounded-lg">
                        <div>
                            <div className="font-medium text-fb-text dark:text-fb-text-dark">Clear Cache</div>
                            <div className="text-sm text-fb-secondary dark:text-fb-secondary-dark">Clear stored data and cache</div>
                        </div>
                        <button className="btn btn-secondary">Clear</button>
                    </div>
                </div>
            </div>
            
            <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-500">Danger Zone</h3>
                <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-r-lg">
                    <p className="text-sm text-red-800 dark:text-red-300 mb-4">Permanently delete your account and all associated data. This action is irreversible.</p>
                    <button onClick={handleDeleteAccount} className="btn btn-danger">Delete My Account</button>
                </div>
            </div>
        </div>
    );



    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3 text-fb-text dark:text-fb-text-dark">
                    <span className="material-icons-outlined text-fb-primary">settings</span>Settings
                </h1>
                <p className="text-fb-secondary dark:text-fb-secondary-dark mt-1 text-base">Manage your account settings and preferences.</p>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-fb-border dark:border-fb-border-dark mb-8">
                <nav className="flex space-x-8 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                                activeTab === tab.id
                                    ? 'border-fb-primary text-fb-primary'
                                    : 'border-transparent text-fb-secondary dark:text-fb-secondary-dark hover:text-fb-text dark:hover:text-fb-text-dark hover:border-fb-border dark:hover:border-fb-border-dark'
                            }`}
                        >
                            <span className="material-icons-outlined text-base">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
        </div>
    );
};

export default Settings;