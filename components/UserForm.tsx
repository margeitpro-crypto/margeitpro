import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { uploadFile } from '../services/gasClient';
import { adminMenu, generalMenu } from './Layout';

const allPages = [...adminMenu.items, ...generalMenu.items];

interface UserFormProps {
    user: User | null;
    onSave: (user: Partial<User>, newProfilePicture: File | null) => void;
    onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<User>>({
        name: '',
        email: '',
        role: 'User',
        status: 'Active',
        accessPage: [],
        plan: 'Free',
        inactiveDate: '',
        profilePictureId: undefined,
        ...user,
    });
    const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const initialData = {
            name: '',
            email: '',
            role: 'User',
            status: 'Active',
            accessPage: [],
            plan: 'Free',
            inactiveDate: '',
            profilePictureId: undefined,
            profilePictureUrl: undefined,
            ...user
        };
        setFormData(initialData);
        setNewProfilePicture(null);
        setErrors({});
        if (initialData.profilePictureUrl) {
            setImagePreview(initialData.profilePictureUrl);
        } else if (initialData.profilePictureId) {
            setImagePreview(`https://lh3.googleusercontent.com/d/${initialData.profilePictureId}`);
        } else {
            setImagePreview(null);
        }
    }, [user]);

    const validateForm = (): boolean => {
        const newErrors: {[key: string]: string} = {};

        if (!formData.name?.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email?.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (formData.status === 'Inactive' && !formData.inactiveDate) {
            newErrors.inactiveDate = 'Inactive date is required for inactive users';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, profilePicture: 'Please select a valid image file' }));
                return;
            }
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, profilePicture: 'Image size must be less than 5MB' }));
                return;
            }
            setNewProfilePicture(file);
            setImagePreview(URL.createObjectURL(file));
            setErrors(prev => ({ ...prev, profilePicture: '' }));
        }
    };

    const handleAccessPageChange = (pageId: string, checked: boolean) => {
        const currentPages = Array.isArray(formData.accessPage)
            ? formData.accessPage
            : (formData.accessPage || '').split(',').map(p => p.trim()).filter(Boolean);
        const newPages = checked ? [...currentPages, pageId] : currentPages.filter(p => p !== pageId);
        setFormData(prev => ({ ...prev, accessPage: newPages }));
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as User['status'];
        const newInactiveDate = (newStatus === 'Inactive' && !formData.inactiveDate)
            ? new Date().toISOString().split('T')[0]
            : newStatus === 'Active' ? undefined : formData.inactiveDate;

        setFormData(p => ({ ...p, status: newStatus, inactiveDate: newInactiveDate }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            let finalUserData = { ...formData };
            if (newProfilePicture) {
                const uploadResult = await uploadFile(newProfilePicture);
                finalUserData.profilePictureId = uploadResult.id;
            }

            const userDataToSave = {
                ...finalUserData,
                accessPage: Array.isArray(finalUserData.accessPage)
                    ? finalUserData.accessPage.join(',')
                    : finalUserData.accessPage
            };

            onSave(userDataToSave, newProfilePicture);
        } catch (error) {
            console.error('Error saving user:', error);
            setErrors({ submit: 'Failed to save user. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card w-full max-w-3xl">
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">
                        {user ? 'Edit User' : 'Add New User'}
                    </h2>

                    {errors.submit && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {errors.submit}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-grow space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="name">
                                        Name *
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={formData.name || ''}
                                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                        className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                        required
                                        aria-invalid={!!errors.name}
                                        aria-describedby={errors.name ? "name-error" : undefined}
                                    />
                                    {errors.name && (
                                        <p id="name-error" className="text-red-500 text-xs mt-1" role="alert">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                                        Email *
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email || ''}
                                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                        className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                        required
                                        disabled={!!user}
                                        aria-invalid={!!errors.email}
                                        aria-describedby={errors.email ? "email-error" : undefined}
                                    />
                                    {errors.email && (
                                        <p id="email-error" className="text-red-500 text-xs mt-1" role="alert">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="role">
                                        Role
                                    </label>
                                    <select
                                        id="role"
                                        value={formData.role || 'User'}
                                        onChange={e => setFormData(p => ({ ...p, role: e.target.value as User['role'] }))}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
                                    >
                                        <option value="User">User</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="plan">
                                        Plan
                                    </label>
                                    <select
                                        id="plan"
                                        value={formData.plan || 'Free'}
                                        onChange={e => setFormData(p => ({ ...p, plan: e.target.value as User['plan'] }))}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
                                    >
                                        <option value="Free">Free</option>
                                        <option value="Pro">Pro</option>
                                        <option value="Enterprise">Enterprise</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="status">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        value={formData.status || 'Active'}
                                        onChange={handleStatusChange}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                {formData.status === 'Inactive' && (
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="inactiveDate">
                                            Inactive Since *
                                        </label>
                                        <input
                                            id="inactiveDate"
                                            type="date"
                                            value={formData.inactiveDate || ''}
                                            onChange={e => setFormData(p => ({...p, inactiveDate: e.target.value}))}
                                            className={`w-full p-2 border rounded ${errors.inactiveDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                            required
                                            aria-invalid={!!errors.inactiveDate}
                                            aria-describedby={errors.inactiveDate ? "inactive-error" : undefined}
                                        />
                                        {errors.inactiveDate && (
                                            <p id="inactive-error" className="text-red-500 text-xs mt-1" role="alert">
                                                {errors.inactiveDate}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-shrink-0 w-full md:w-40 text-center">
                            <label className="block text-sm font-medium mb-2">
                                Profile Picture
                            </label>
                            <img
                                src={imagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'New User')}&background=random`}
                                className="w-32 h-32 rounded-full object-cover mx-auto mb-2 border-2 border-dashed border-gray-300 dark:border-gray-600"
                                alt="Profile"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="btn btn-secondary text-sm"
                                disabled={isSubmitting}
                            >
                                Upload Image
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                            {errors.profilePicture && (
                                <p className="text-red-500 text-xs mt-1" role="alert">
                                    {errors.profilePicture}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">Access Pages</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-md">
                            {allPages.map(page => (
                                <label key={page.id} className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={(Array.isArray(formData.accessPage)
                                            ? formData.accessPage
                                            : (formData.accessPage || '').split(',')
                                        ).includes(page.id)}
                                        onChange={e => handleAccessPageChange(page.id, e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                                        disabled={isSubmitting}
                                    />
                                    {page.label}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-slate-800 p-4 flex justify-end gap-3 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-secondary"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="spinner w-4 h-4 mr-2"></div>
                                Saving...
                            </>
                        ) : (
                            'Save User'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserForm;
