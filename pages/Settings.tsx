import React, { useState, useEffect, useRef } from 'react';
import { PageProps, User } from '../types';
import { uploadFile, updateUserByUser } from '../services/gasClient';
import { adminMenu, generalMenu } from '../components/Layout';
import ThemeSettings from '../components/ThemeSettings';

const allPagesMap = new Map([...adminMenu.items, ...generalMenu.items].map(item => [item.id, item.label]));

const Settings: React.FC<PageProps> = ({ setModal, user }) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // The user object is now passed directly via props.
    // No need for local state for the user, loading, or error.
    const currentUser = user;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && currentUser && currentUser.id) {
            const file = e.target.files[0];
            setIsUploading(true);
            try {
                const uploadResult = await uploadFile(file);
                await updateUserByUser(currentUser, { profilePictureUrl: uploadResult.url });
                // Note: The profile picture will visually update on the next page load/refresh
                // as this component cannot directly mutate the state in App.tsx.
                alert("Profile picture updated successfully! The change will be visible on your next session.");
            } catch (err) {
                alert(`Error uploading file: ${(err as Error).message}`);
            } finally {
                setIsUploading(false);
            }
        }
    };

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

    return (
        <div className="max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <span className="material-icons-outlined text-blue-600 dark:text-blue-500">settings</span>Settings
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-base">Manage your account settings and preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2">
                    <div className="card">
                        <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-inherit">
                            <div className="flex items-center gap-4">
                                <div className="relative group">
                                    <img 
                                        src={getUserAvatar(currentUser)} 
                                        className="w-16 h-16 rounded-full object-cover" 
                                        alt={currentUser.name}
                                    />
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity duration-300"
                                        disabled={isUploading}
                                    >
                                        {isUploading 
                                            ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> 
                                            : <span className="material-icons-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity">photo_camera</span>
                                        }
                                    </button>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                                    <p className="text-gray-500 dark:text-gray-400">{currentUser.email}</p>
                                </div>
                            </div>
                            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${currentUser.role === 'Admin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>{currentUser.role}</span>
                        </div>
                        <div className="p-6">
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 text-sm">
                                <div>
                                    <dt className="font-semibold text-gray-500 dark:text-gray-400">Status</dt>
                                    <dd className="mt-1">
                                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${currentUser.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>{currentUser.status}</span>
                                        {currentUser.status === 'Inactive' && currentUser.inactiveDate && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">since {currentUser.inactiveDate}</span>
                                        )}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-gray-500 dark:text-gray-400">Current Plan</dt>
                                    <dd className="mt-1">
                                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${planDetails[currentUser.plan].color}`}>{currentUser.plan}</span>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-gray-500 dark:text-gray-400">Join Date</dt>
                                    <dd className="mt-1 font-medium">{currentUser.joinDate}</dd>
                                </div>
                                <div className="md:col-span-2">
                                     <dt className="font-semibold text-gray-500 dark:text-gray-400 mb-2">Page Access</dt>
                                     <dd>
                                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto rounded-lg p-3 bg-gray-50 dark:bg-slate-800 border border-inherit">
                                            {userAccessPages.map(pageId => (
                                                <span key={pageId} className="bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-200 px-2.5 py-1 text-xs font-medium rounded-full">
                                                    {allPagesMap.get(pageId) || pageId}
                                                </span>
                                            ))}
                                        </div>
                                     </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="card p-6">
                        <h2 className="text-xl font-bold border-b border-inherit pb-4 mb-4">Account Security</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Your account is secured by Google. To change your password or manage security settings, visit your Google Account.</p>
                        <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                            Manage Google Account <span className="material-icons-outlined text-base">open_in_new</span>
                        </a>
                    </div>

                    <div className="card p-6">
                        <h2 className="text-xl font-bold border-b border-inherit pb-4 mb-4">Theme Settings</h2>
                        <ThemeSettings />
                    </div>

                    <div className="card p-6">
                        <h2 className="text-xl font-bold border-b border-inherit pb-4 mb-4">Notification Settings</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Customize how you receive notifications:</p>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Merge Completion</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Get notified when your merges complete</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">System Updates</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Receive notifications about system updates</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Marketing Emails</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Receive tips, tutorials, and product updates</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Error Alerts</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Get notified when operations fail</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h2 className="text-xl font-bold border-b border-inherit pb-4 mb-4">Keyboard Shortcuts</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Use these shortcuts to navigate faster:</p>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center py-1">
                                <span>Dashboard</span>
                                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Ctrl + D</kbd>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span>Merge It</span>
                                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Ctrl + M</kbd>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span>Merge Logs</span>
                                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Ctrl + L</kbd>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span>Templates</span>
                                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Ctrl + T</kbd>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span>Toggle Theme</span>
                                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Ctrl + /</kbd>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h2 className="text-xl font-bold text-red-600 dark:text-red-500">Delete Account</h2>
                        <div className="mt-4 p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-r-lg">
                            <p className="text-sm text-red-800 dark:text-red-300">Permanently delete your account and all associated data. This action is irreversible.</p>
                        </div>
                        <button onClick={handleDeleteAccount} className="btn btn-danger mt-6">Delete My Account</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;