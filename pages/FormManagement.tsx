
import React, { useState, useEffect, useRef } from 'react';
import { Template, BillingPlan, User, Notification, PageProps } from '../types';
import {
    getTemplatesData, addTemplate, updateTemplate, deleteTemplate,
    getBillingPlansData, addBillingPlan, updateBillingPlan, deleteBillingPlan,
    sendNotification, getNotificationsData, addNotification, updateNotification, deleteNotification,
    getUsersData,
    updateUser,
    uploadFile,
    getPaymentHistoryData,
} from '../services/gasClient';
import { adminMenu, generalMenu } from '../components/Layout';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../services/firebase';

const allPages = [...adminMenu.items, ...generalMenu.items];

// --- Template Management ---

const TemplateForm: React.FC<{ template: Partial<Template> | null; onSave: (data: Partial<Template>) => void; onCancel: () => void; isSubmitting: boolean; }> = ({ template, onSave, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState<Partial<Template>>({ name: '', id: '', type: 'Slides', plan: 'Free', description: '', imageUrl: '', imageUrl2: '', sheetUrl: '', ...template });
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    useEffect(() => {
        const initialData = { name: '', id: '', type: 'Slides', plan: 'Free', description: '', imageUrl: '', imageUrl2: '', sheetUrl: '', ...template };
        setFormData(initialData);
        setErrors({});
    }, [template]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};
        if (!formData.name?.trim()) newErrors.name = 'Template name is required';
        if (!formData.id?.trim()) newErrors.id = 'Template ID is required';
        if (!formData.description?.trim()) newErrors.description = 'Description is required';
        if (formData.imageUrl && !formData.imageUrl.match(/^https?:\/\/.+/)) newErrors.imageUrl = 'Invalid URL format';
        if (formData.imageUrl2 && !formData.imageUrl2.match(/^https?:\/\/.+/)) newErrors.imageUrl2 = 'Invalid URL format';
        if (formData.sheetUrl && !formData.sheetUrl.match(/^https?:\/\/.+/)) newErrors.sheetUrl = 'Invalid URL format';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        onSave(formData);
    };

    const handleReset = () => {
        setFormData({ name: '', id: '', type: 'Slides', plan: 'Free', description: '', imageUrl: '', imageUrl2: '', sheetUrl: '', ...template });
        setErrors({});
    };

    return (
        <div className="card w-full max-w-lg">
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">{template?.id ? 'Edit Template' : 'Add New Template'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="template-name" className="block text-sm font-medium mb-1">Template Name *</label>
                            <input
                                id="template-name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                required
                                aria-describedby={errors.name ? "name-error" : undefined}
                            />
                            {errors.name && <p id="name-error" className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="template-id" className="block text-sm font-medium mb-1">Template ID *</label>
                            <input
                                id="template-id"
                                type="text"
                                name="id"
                                value={formData.id}
                                onChange={handleInputChange}
                                className={`w-full p-2 border rounded ${errors.id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                required
                                disabled={!!template?.id}
                                aria-describedby={errors.id ? "id-error" : undefined}
                            />
                            {errors.id && <p id="id-error" className="text-xs text-red-500 mt-1">{errors.id}</p>}
                        </div>
                        <div>
                            <label htmlFor="template-type" className="block text-sm font-medium mb-1">Type</label>
                            <select
                                id="template-type"
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
                            >
                                <option>Slides</option>
                                <option>Docs</option>
                                <option>Sheet</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="template-plan" className="block text-sm font-medium mb-1">Plan</label>
                            <select
                                id="template-plan"
                                name="plan"
                                value={formData.plan}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
                            >
                                <option>Free</option>
                                <option>Pro</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="template-description" className="block text-sm font-medium mb-1">Description *</label>
                            <textarea
                                id="template-description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className={`w-full p-2 border rounded h-20 resize-none ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                required
                                aria-describedby={errors.description ? "description-error" : undefined}
                            />
                            {errors.description && <p id="description-error" className="text-xs text-red-500 mt-1">{errors.description}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="template-image-url" className="block text-sm font-medium mb-1">Image URL</label>
                            <input
                                id="template-image-url"
                                type="url"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleInputChange}
                                placeholder="https://drive.google.com/file/d/.../view or direct image URL"
                                className={`w-full p-2 border rounded ${errors.imageUrl ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                aria-describedby={errors.imageUrl ? "image-url-error" : "image-url-help"}
                            />
                            {errors.imageUrl ? (
                                <p id="image-url-error" className="text-xs text-red-500 mt-1">{errors.imageUrl}</p>
                            ) : (
                                <p id="image-url-help" className="text-xs text-gray-500 dark:text-gray-400 mt-1">Google Drive sharing links will be automatically converted for preview</p>
                            )}
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="template-image-url2" className="block text-sm font-medium mb-1">Second Image URL (Optional)</label>
                            <input
                                id="template-image-url2"
                                type="url"
                                name="imageUrl2"
                                value={formData.imageUrl2}
                                onChange={handleInputChange}
                                placeholder="https://drive.google.com/file/d/.../view or direct image URL"
                                className={`w-full p-2 border rounded ${errors.imageUrl2 ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                aria-describedby={errors.imageUrl2 ? "image-url2-error" : "image-url2-help"}
                            />
                            {errors.imageUrl2 ? (
                                <p id="image-url2-error" className="text-xs text-red-500 mt-1">{errors.imageUrl2}</p>
                            ) : (
                                <p id="image-url2-help" className="text-xs text-gray-500 dark:text-gray-400 mt-1">Optional second image for template preview</p>
                            )}
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="template-sheet-url" className="block text-sm font-medium mb-1">Google Sheet URL (Optional)</label>
                            <input
                                id="template-sheet-url"
                                type="url"
                                name="sheetUrl"
                                value={formData.sheetUrl}
                                onChange={handleInputChange}
                                placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                                className={`w-full p-2 border rounded ${errors.sheetUrl ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                aria-describedby={errors.sheetUrl ? "sheet-url-error" : "sheet-url-help"}
                            />
                            {errors.sheetUrl ? (
                                <p id="sheet-url-error" className="text-xs text-red-500 mt-1">{errors.sheetUrl}</p>
                            ) : (
                                <p id="sheet-url-help" className="text-xs text-gray-500 dark:text-gray-400 mt-1">Optional Google Sheet URL for data source</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-800 p-4 flex justify-between items-center rounded-b-xl">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="btn btn-secondary"
                        disabled={isSubmitting}
                        title="Reset form to initial values"
                    >
                        Reset
                    </button>
                    <div className="flex gap-3">
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
                                'Save Template'
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

const TemplateManagement: React.FC<PageProps> = ({ setModal }) => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Partial<Template> | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getTemplatesData();
            setTemplates(data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAdd = () => { setEditingTemplate({}); setIsModalOpen(true); };
    const handleEdit = (template: Template) => { setEditingTemplate(template); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setEditingTemplate(null); };

    const handleSave = async (data: Partial<Template>) => {
        setIsSubmitting(true);
        try {
            let finalData = { ...data };
            console.log('Saving template with data:', finalData);

            if (editingTemplate?.id) {
                console.log('Updating existing template:', editingTemplate.id);
                await updateTemplate(editingTemplate.id, finalData);
                console.log('Template updated successfully');
            } else {
                console.log('Adding new template');
                await addTemplate(finalData);
                console.log('Template added successfully');
            }
            await fetchData();
            console.log('Data refetched after save');
        } catch(e) {
            console.error('Error saving template:', e);
            alert(`Error: ${(e as Error).message}`);
        }
        finally {
            setIsSubmitting(false);
            handleCloseModal();
        }
    };

    const handleDelete = (template: Template) => {
        setModal({
            type: 'confirmation',
            props: {
                title: 'Delete Template',
                message: `Are you sure you want to delete the template <strong>${template.name}</strong>? This action cannot be undone.`,
                onConfirm: async () => {
                    try {
                        await deleteTemplate(template.id);
                        await fetchData();
                    } catch (e) {
                        alert(`Error: ${(e as Error).message}`);
                    }
                    setModal({ type: null, props: {} });
                }
            }
        });
    };
    
    return (
        <div>
            <div className="flex justify-between items-center pb-4">
                <div><h2 className="text-lg font-bold">Manage Templates</h2><p className="text-sm text-gray-500 dark:text-gray-400">Add, edit, or delete templates.</p></div>
                <button onClick={handleAdd} className="btn btn-primary"><span className="material-icons-outlined">add</span> New Template</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left" role="table" aria-label="Templates management table">
                    <thead className="border-b border-inherit text-gray-500 dark:text-gray-400 text-sm">
                        <tr>
                            <th className="py-2 px-3 font-semibold" scope="col">SN</th>
                            <th className="py-2 px-3 font-semibold" scope="col">Name</th>
                            <th className="py-2 px-3 font-semibold" scope="col">Type</th>
                            <th className="py-2 px-3 font-semibold" scope="col">Plan</th>
                            <th className="py-2 px-3 font-semibold text-right" scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-6">
                                    <div className="spinner mx-auto" aria-label="Loading templates"></div>
                                </td>
                            </tr>
                        ) : templates.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-6 text-gray-500 dark:text-gray-400">
                                    No templates found
                                </td>
                            </tr>
                        ) : (
                            templates.map((t, index) => (
                                <tr key={t.id} className="border-b border-inherit last:border-b-0 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                    <td className="py-3 px-3 text-gray-500 dark:text-gray-400">{index + 1}</td>
                                    <td className="py-3 px-3 font-medium">{t.name}</td>
                                    <td className="py-3 px-3 text-gray-500 dark:text-gray-400">{t.type}</td>
                                    <td className="py-3 px-3 text-gray-500 dark:text-gray-400">{t.plan}</td>
                                    <td className="py-3 px-3 text-right">
                                        <button
                                            onClick={() => handleEdit(t)}
                                            className="material-icons-outlined p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
                                            title="Edit template"
                                            aria-label={`Edit ${t.name}`}
                                        >
                                            edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(t)}
                                            className="material-icons-outlined p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                            title="Delete template"
                                            aria-label={`Delete ${t.name}`}
                                        >
                                            delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="fixed inset-0" onClick={handleCloseModal}></div><div className="relative z-10"><TemplateForm template={editingTemplate} onSave={handleSave} onCancel={handleCloseModal} isSubmitting={isSubmitting} /></div>
            </div>)}
        </div>
    );
};


// --- Billing Management ---

const BillingForm: React.FC<{ plan: Partial<BillingPlan> | null; onSave: (data: Partial<BillingPlan>) => void; onCancel: () => void; isSubmitting: boolean; }> = ({ plan, onSave, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState(() => {
        const { features, ...rest } = plan || {};
        return { name: '', price: '', pricePeriod: '/ mo', buttonText: 'Get Started', isActive: true, currency: 'USD', order: '', ...rest, features: Array.isArray(features) ? features.join('\n') : '' };
    });
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    useEffect(() => {
        const { features, ...rest } = plan || {};
        setFormData({ name: '', price: '', pricePeriod: '/ mo', buttonText: 'Get Started', isActive: true, currency: 'USD', order: '', ...rest, features: Array.isArray(features) ? features.join('\n') : '' });
        setErrors({});
    }, [plan]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(p => ({ ...p, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(p => ({ ...p, [e.target.name]: e.target.checked }));
    };

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};
        if (!formData.name?.trim()) newErrors.name = 'Plan name is required';
        if (!formData.price?.toString().trim()) newErrors.price = 'Price is required';
        if (!formData.buttonText?.trim()) newErrors.buttonText = 'Button text is required';
        if (!formData.features?.trim()) newErrors.features = 'At least one feature is required';
        if (formData.order && (isNaN(Number(formData.order)) || Number(formData.order) < 1)) {
            newErrors.order = 'Order must be a positive number';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        onSave({ ...formData, features: formData.features.split('\n').filter(f => f.trim()) });
    };

    const handleReset = () => {
        const { features, ...rest } = plan || {};
        setFormData({ name: '', price: '', pricePeriod: '/ mo', buttonText: 'Get Started', isActive: true, currency: 'USD', order: '', ...rest, features: Array.isArray(features) ? features.join('\n') : '' });
        setErrors({});
    };

    return (
        <div className="card w-full max-w-lg">
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">{plan?.id ? 'Edit Plan' : 'Add New Plan'}</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="billing-name" className="block text-sm font-medium mb-1">Plan Name *</label>
                            <input
                                id="billing-name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g., Pro Plan"
                                className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                required
                                aria-describedby={errors.name ? "billing-name-error" : undefined}
                            />
                            {errors.name && <p id="billing-name-error" className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="billing-price" className="block text-sm font-medium mb-1">Price *</label>
                                <input
                                    id="billing-price"
                                    type="text"
                                    name="price"
                                    value={formData.price as string}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 15 or 'Contact Us'"
                                    className={`w-full p-2 border rounded ${errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                    required
                                    aria-describedby={errors.price ? "billing-price-error" : undefined}
                                />
                                {errors.price && <p id="billing-price-error" className="text-xs text-red-500 mt-1">{errors.price}</p>}
                            </div>
                            <div>
                                <label htmlFor="billing-currency" className="block text-sm font-medium mb-1">Currency</label>
                                <select
                                    id="billing-currency"
                                    name="currency"
                                    value={formData.currency || 'USD'}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="NPR">NPR (रू)</option>
                                    <option value="INR">INR (₹)</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="billing-price-period" className="block text-sm font-medium mb-1">Price Period</label>
                                <input
                                    id="billing-price-period"
                                    type="text"
                                    name="pricePeriod"
                                    value={formData.pricePeriod}
                                    onChange={handleInputChange}
                                    placeholder="e.g., / mo"
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="billing-button-text" className="block text-sm font-medium mb-1">Button Text *</label>
                                <input
                                    id="billing-button-text"
                                    type="text"
                                    name="buttonText"
                                    value={formData.buttonText}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Get Started"
                                    className={`w-full p-2 border rounded ${errors.buttonText ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                    required
                                    aria-describedby={errors.buttonText ? "billing-button-text-error" : undefined}
                                />
                                {errors.buttonText && <p id="billing-button-text-error" className="text-xs text-red-500 mt-1">{errors.buttonText}</p>}
                            </div>
                            <div>
                                <label htmlFor="billing-order" className="block text-sm font-medium mb-1">Display Order</label>
                                <input
                                    id="billing-order"
                                    type="number"
                                    name="order"
                                    value={formData.order || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 1"
                                    className={`w-full p-2 border rounded ${errors.order ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                    min="1"
                                    aria-describedby={errors.order ? "billing-order-error" : "billing-order-help"}
                                />
                                {errors.order ? (
                                    <p id="billing-order-error" className="text-xs text-red-500 mt-1">{errors.order}</p>
                                ) : (
                                    <p id="billing-order-help" className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lower numbers appear first on homepage</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="billing-features" className="block text-sm font-medium mb-1">Features (one per line) *</label>
                            <textarea
                                id="billing-features"
                                name="features"
                                value={formData.features}
                                onChange={handleInputChange}
                                placeholder="- Unlimited merges&#10;- Priority support"
                                className={`w-full p-2 border rounded h-24 resize-none ${errors.features ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                required
                                aria-describedby={errors.features ? "billing-features-error" : undefined}
                            />
                            {errors.features && <p id="billing-features-error" className="text-xs text-red-500 mt-1">{errors.features}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                id="billing-is-active"
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleCheckboxChange}
                                className="h-4 w-4"
                            />
                            <label htmlFor="billing-is-active" className="text-sm font-medium">Active (Show on homepage)</label>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-800 p-4 flex justify-between items-center rounded-b-xl">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="btn btn-secondary"
                        disabled={isSubmitting}
                        title="Reset form to initial values"
                    >
                        Reset
                    </button>
                    <div className="flex gap-3">
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
                                'Save Plan'
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

const BillingManagement: React.FC<PageProps> = ({ setModal }) => {
    const [plans, setPlans] = useState<BillingPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Partial<BillingPlan> | null>(null);
    const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try { const data = await getBillingPlansData(); setPlans(data); }
        catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const fetchPaymentHistory = async () => {
        setLoadingHistory(true);
        try {
            const data = await getPaymentHistoryData();
            setPaymentHistory(data);
        } catch (err) {
            console.error('Error fetching payment history:', err);
        } finally {
            setLoadingHistory(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchPaymentHistory();
    }, []);

    const handleAdd = () => { setEditingPlan({}); setIsModalOpen(true); };
    const handleEdit = (plan: BillingPlan) => { setEditingPlan(plan); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setEditingPlan(null); };

    const handleSave = async (data: Partial<BillingPlan>) => {
        setIsSubmitting(true);
        try {
            const planData = { ...data, price: isNaN(Number(data.price)) ? data.price : Number(data.price) };
            if (editingPlan?.id) { await updateBillingPlan(editingPlan.id, planData); } else { await addBillingPlan(planData); }
            await fetchData();
        } catch(e) { alert(`Error: ${(e as Error).message}`); }
        finally { setIsSubmitting(false); handleCloseModal(); }
    };
    
    const handleDelete = (plan: BillingPlan) => {
        setModal({
            type: 'confirmation',
            props: {
                title: 'Delete Plan',
                message: `Are you sure you want to delete the billing plan <strong>${plan.name}</strong>? This action cannot be undone.`,
                onConfirm: async () => {
                    try {
                        await deleteBillingPlan(plan.id);
                        await fetchData();
                    } catch (e) {
                        alert(`Error: ${(e as Error).message}`);
                    }
                    setModal({ type: null, props: {} });
                }
            }
        });
    };

    return (
         <div>
            <div className="flex justify-between items-center pb-4">
                <div><h2 className="text-lg font-bold">Manage Billing Plans</h2><p className="text-sm text-gray-500 dark:text-gray-400">Add, edit, or delete subscription plans.</p></div>
                <button onClick={handleAdd} className="btn btn-primary"><span className="material-icons-outlined">add</span> New Plan</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left" role="table" aria-label="Billing plans management table">
                    <thead className="border-b border-inherit text-gray-500 dark:text-gray-400 text-sm">
                        <tr>
                            <th className="py-2 px-3 font-semibold" scope="col">SN</th>
                            <th className="py-2 px-3 font-semibold" scope="col">Order</th>
                            <th className="py-2 px-3 font-semibold" scope="col">Name</th>
                            <th className="py-2 px-3 font-semibold" scope="col">Price</th>
                            <th className="py-2 px-3 font-semibold" scope="col">Status</th>
                            <th className="py-2 px-3 font-semibold text-right" scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-6">
                                    <div className="spinner mx-auto" aria-label="Loading billing plans"></div>
                                </td>
                            </tr>
                        ) : plans.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-6 text-gray-500 dark:text-gray-400">
                                    No billing plans found
                                </td>
                            </tr>
                        ) : (
                            plans.map((p, index) => (
                                <tr key={p.id} className="border-b border-inherit last:border-b-0 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                    <td className="py-3 px-3 text-gray-500 dark:text-gray-400">{index + 1}</td>
                                    <td className="py-3 px-3 text-gray-500 dark:text-gray-400">{p.order || '-'}</td>
                                    <td className="py-3 px-3 font-medium">{p.name}</td>
                                    <td className="py-3 px-3 text-gray-500 dark:text-gray-400">
                                        {typeof p.price === 'number' ? `${p.currency === 'NPR' ? 'रू' : p.currency === 'INR' ? '₹' : '$'}${p.price}` : p.price}{p.pricePeriod}
                                    </td>
                                    <td className="py-3 px-3">
                                        <select
                                            value={p.isActive !== false ? 'active' : 'inactive'}
                                            onChange={async (e) => {
                                                const isActive = e.target.value === 'active';
                                                try {
                                                    await updateBillingPlan(p.id, { ...p, isActive });
                                                    await fetchData();
                                                } catch (err) {
                                                    alert('Error updating plan status');
                                                }
                                            }}
                                            className={`p-1 text-xs rounded cursor-pointer ${p.isActive !== false ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}
                                            aria-label={`Change status for ${p.name}`}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </td>
                                    <td className="py-3 px-3 text-right">
                                        <button
                                            onClick={() => handleEdit(p)}
                                            className="material-icons-outlined p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
                                            title="Edit plan"
                                            aria-label={`Edit ${p.name}`}
                                        >
                                            edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p)}
                                            className="material-icons-outlined p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                            title="Delete plan"
                                            aria-label={`Delete ${p.name}`}
                                        >
                                            delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">Display Order Information</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    Plans are displayed on the homepage in ascending order based on the "Order" number. Lower numbers appear first.
                    Plans without an order number will appear at the end.
                </p>
            </div>
        </div>

            <div className="mt-8 pt-6 border-t border-inherit">
                <h3 className="text-lg font-bold mb-4">Payment Information</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Track payment confirmations and user subscriptions by Gmail ID.</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-inherit text-gray-500 dark:text-gray-400 text-sm">
                            <tr>
                                <th className="py-2 px-3 font-semibold">SN</th>
                                <th className="py-2 px-3 font-semibold">Gmail ID</th>
                                <th className="py-2 px-3 font-semibold">Transaction ID</th>
                                <th className="py-2 px-3 font-semibold">Plan</th>
                                <th className="py-2 px-3 font-semibold">Status</th>
                                <th className="py-2 px-3 font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loadingHistory ? (
                                <tr><td colSpan={6} className="text-center py-6"><div className="spinner mx-auto"></div></td></tr>
                            ) : paymentHistory.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-6 text-gray-500 dark:text-gray-400">No payment history found</td></tr>
                            ) : (
                                paymentHistory.map((payment, index) => (
                                    <tr key={payment.id || index} className="border-b border-inherit last:border-b-0">
                                        <td className="py-3 px-3 text-gray-500 dark:text-gray-400">{index + 1}</td>
                                        <td className="py-3 px-3 font-medium">{payment.gmailId}</td>
                                        <td className="py-3 px-3 text-gray-500 dark:text-gray-400">{payment.transactionId}</td>
                                        <td className="py-3 px-3 text-gray-500 dark:text-gray-400">{payment.plan}</td>
                                        <td className="py-3 px-3">
                                            <span className={`px-2 py-1 text-xs rounded ${payment.status === 'Success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 text-gray-500 dark:text-gray-400">{new Date(payment.timestamp).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="fixed inset-0" onClick={handleCloseModal}></div><div className="relative z-10"><BillingForm plan={editingPlan} onSave={handleSave} onCancel={handleCloseModal} isSubmitting={isSubmitting} /></div>
            </div>)}
        </div>
    );
};

// --- Notification Form ---
const NotificationForm: React.FC<{ notification: Partial<Notification> | null; onSave: (data: Partial<Notification>) => void; onCancel: () => void; isSubmitting: boolean; }> = ({ notification, onSave, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState<Partial<Notification>>({
        title: '',
        message: '',
        priority: 'Medium',
        category: 'Info',
        actionUrl: '',
        actionText: '',
        isNew: true,
        timestamp: new Date().toISOString(),
        ...notification
    });
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    useEffect(() => {
        const initialData = {
            title: '',
            message: '',
            priority: 'Medium',
            category: 'Info',
            actionUrl: '',
            actionText: '',
            isNew: true,
            timestamp: new Date().toISOString(),
            ...notification
        };
        setFormData(initialData);
        setErrors({});
    }, [notification]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};
        if (!formData.title?.trim()) newErrors.title = 'Notification title is required';
        if (!formData.message?.trim()) newErrors.message = 'Notification message is required';
        if (formData.actionUrl && !formData.actionUrl.match(/^https?:\/\/.+/)) newErrors.actionUrl = 'Invalid URL format';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        onSave(formData);
    };

    const handleReset = () => {
        setFormData({
            title: '',
            message: '',
            priority: 'Medium',
            category: 'Info',
            actionUrl: '',
            actionText: '',
            isNew: true,
            timestamp: new Date().toISOString(),
            ...notification
        });
        setErrors({});
    };

    return (
        <div className="card w-full max-w-2xl">
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">{notification?.id ? 'Edit Notification' : 'Add New Notification'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="notification-title" className="block text-sm font-medium mb-1">Title *</label>
                            <input
                                id="notification-title"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                required
                                aria-describedby={errors.title ? "notification-title-error" : undefined}
                            />
                            {errors.title && <p id="notification-title-error" className="text-xs text-red-500 mt-1">{errors.title}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="notification-message" className="block text-sm font-medium mb-1">Message *</label>
                            <textarea
                                id="notification-message"
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                className={`w-full p-2 border rounded h-24 resize-none ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                required
                                aria-describedby={errors.message ? "notification-message-error" : undefined}
                            />
                            {errors.message && <p id="notification-message-error" className="text-xs text-red-500 mt-1">{errors.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="notification-priority" className="block text-sm font-medium mb-1">Priority</label>
                            <select
                                id="notification-priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="notification-category" className="block text-sm font-medium mb-1">Category</label>
                            <select
                                id="notification-category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
                            >
                                <option>Info</option>
                                <option>Update</option>
                                <option>Alert</option>
                                <option>System</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="notification-action-url" className="block text-sm font-medium mb-1">Action URL (Optional)</label>
                            <input
                                id="notification-action-url"
                                type="url"
                                name="actionUrl"
                                value={formData.actionUrl}
                                onChange={handleInputChange}
                                placeholder="https://..."
                                className={`w-full p-2 border rounded ${errors.actionUrl ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                aria-describedby={errors.actionUrl ? "notification-action-url-error" : undefined}
                            />
                            {errors.actionUrl && <p id="notification-action-url-error" className="text-xs text-red-500 mt-1">{errors.actionUrl}</p>}
                        </div>
                        <div>
                            <label htmlFor="notification-action-text" className="block text-sm font-medium mb-1">Action Text (Optional)</label>
                            <input
                                id="notification-action-text"
                                type="text"
                                name="actionText"
                                value={formData.actionText}
                                onChange={handleInputChange}
                                placeholder="e.g., View Details"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-800 p-4 flex justify-between items-center rounded-b-xl">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="btn btn-secondary"
                        disabled={isSubmitting}
                        title="Reset form to initial values"
                    >
                        Reset
                    </button>
                    <div className="flex gap-3">
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
                                'Save Notification'
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

// --- Notification Management ---
const NotificationManagement: React.FC<PageProps> = ({ setModal, refreshNotifications }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingNotification, setEditingNotification] = useState<Partial<Notification> | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getNotificationsData();
            setNotifications(data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAdd = () => { setEditingNotification({}); setIsModalOpen(true); };
    const handleEdit = (notification: Notification) => { setEditingNotification(notification); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setEditingNotification(null); };

    const handleSave = async (data: Partial<Notification>) => {
        setIsSubmitting(true);
        try {
            if (editingNotification?.id) {
                await updateNotification(editingNotification.id, data);
            } else {
                await addNotification(data);
            }
            await fetchData();
            if (refreshNotifications) {
                refreshNotifications();
            }
        } catch(e) {
            alert(`Error: ${(e as Error).message}`);
        }
        finally {
            setIsSubmitting(false);
            handleCloseModal();
        }
    };

    const handleDelete = (notification: Notification) => {
        setModal({
            type: 'confirmation',
            props: {
                title: 'Delete Notification',
                message: `Are you sure you want to delete the notification <strong>${notification.title}</strong>? This action cannot be undone.`,
                onConfirm: async () => {
                    try {
                        await deleteNotification(notification.id);
                        await fetchData();
                        if (refreshNotifications) {
                            refreshNotifications();
                        }
                    } catch (e) {
                        alert(`Error: ${(e as Error).message}`);
                    }
                    setModal({ type: null, props: {} });
                }
            }
        });
    };

    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
    const [category, setCategory] = useState<'System' | 'Update' | 'Alert' | 'Info'>('Info');
    const [actionUrl, setActionUrl] = useState('');
    const [actionText, setActionText] = useState('');
    const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus(null);
        try {
            const notificationData = {
                title,
                message,
                priority,
                category,
                ...(actionUrl && { actionUrl }),
                ...(actionText && { actionText })
            };
            await sendNotification(notificationData);

            // Refresh notifications in the app
            if (refreshNotifications) {
                refreshNotifications();
            }

            // Show toast notification
            if ((window as any).showToast) {
                (window as any).showToast({
                    type: 'success',
                    title: 'Notification Sent',
                    message: 'Notification has been sent to all users successfully!',
                    duration: 3000
                });
            }

            setStatus({ type: 'success', text: 'Notification sent successfully to all users!' });
            setTitle('');
            setMessage('');
            setPriority('Medium');
            setCategory('Info');
            setActionUrl('');
            setActionText('');
        } catch (err) {
            setStatus({ type: 'error', text: 'Failed to send notification.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const priorityColors = {
        Low: 'text-green-600',
        Medium: 'text-yellow-600',
        High: 'text-red-600'
    };

    const categoryIcons = {
        System: 'settings',
        Update: 'update',
        Alert: 'warning',
        Info: 'info'
    };

    return (
        <div>
            <div className="flex justify-between items-center pb-4">
                <div><h2 className="text-lg font-bold">Manage Notifications</h2><p className="text-sm text-gray-500 dark:text-gray-400">Add, edit, or delete notifications and broadcast to users.</p></div>
                <button onClick={handleAdd} className="btn btn-primary"><span className="material-icons-outlined">add</span> New Notification</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left" role="table" aria-label="Notifications management table">
                    <thead className="border-b border-inherit text-gray-500 dark:text-gray-400 text-sm">
                        <tr>
                            <th className="py-2 px-3 font-semibold" scope="col">SN</th>
                            <th className="py-2 px-3 font-semibold" scope="col">Title</th>
                            <th className="py-2 px-3 font-semibold" scope="col">Priority</th>
                            <th className="py-2 px-3 font-semibold" scope="col">Category</th>
                            <th className="py-2 px-3 font-semibold text-right" scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-6">
                                    <div className="spinner mx-auto" aria-label="Loading notifications"></div>
                                </td>
                            </tr>
                        ) : notifications.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-6 text-gray-500 dark:text-gray-400">
                                    No notifications found
                                </td>
                            </tr>
                        ) : (
                            notifications.map((notif, index) => (
                                <tr key={notif.id} className="border-b border-inherit last:border-b-0 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                    <td className="py-3 px-3 text-gray-500 dark:text-gray-400">{index + 1}</td>
                                    <td className="py-3 px-3 font-medium">{notif.title}</td>
                                    <td className="py-3 px-3 text-gray-500 dark:text-gray-400">{notif.priority}</td>
                                    <td className="py-3 px-3 text-gray-500 dark:text-gray-400">{notif.category}</td>
                                    <td className="py-3 px-3 text-right">
                                        <button
                                            onClick={() => handleEdit(notif)}
                                            className="material-icons-outlined p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
                                            title="Edit notification"
                                            aria-label={`Edit ${notif.title}`}
                                        >
                                            edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(notif)}
                                            className="material-icons-outlined p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                            title="Delete notification"
                                            aria-label={`Delete ${notif.title}`}
                                        >
                                            delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 pt-6 border-t border-inherit">
                <h3 className="text-lg font-bold mb-2">Broadcast Notification</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Send a notification to all active users with enhanced features.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., New Feature Alert!" className="w-full p-2" required /></div>
                    <div><label className="block text-sm font-medium mb-1">Message</label><textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe the update or announcement..." className="w-full p-2 h-24" required /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Priority</label>
                            <select value={priority} onChange={e => setPriority(e.target.value as 'Low' | 'Medium' | 'High')} className="w-full p-2">
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select value={category} onChange={e => setCategory(e.target.value as 'System' | 'Update' | 'Alert' | 'Info')} className="w-full p-2">
                                <option value="Info">Info</option>
                                <option value="Update">Update</option>
                                <option value="Alert">Alert</option>
                                <option value="System">System</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium mb-1">Action URL (Optional)</label><input type="url" value={actionUrl} onChange={e => setActionUrl(e.target.value)} placeholder="https://..." className="w-full p-2" /></div>
                        <div><label className="block text-sm font-medium mb-1">Action Text (Optional)</label><input type="text" value={actionText} onChange={e => setActionText(e.target.value)} placeholder="e.g., View Details" className="w-full p-2" /></div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                        <span className="text-sm font-medium">Preview:</span>
                        <span className={`material-icons-outlined text-sm ${priorityColors[priority]}`}>priority_high</span>
                        <span className="material-icons-outlined text-sm">{categoryIcons[category]}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{title || 'Notification Title'}</span>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send Notification'}</button>
                    {status && <p className={`text-sm mt-2 ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{status.text}</p>}
                </form>
            </div>

            {isModalOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="fixed inset-0" onClick={handleCloseModal}></div><div className="relative z-10"><NotificationForm notification={editingNotification} onSave={handleSave} onCancel={handleCloseModal} isSubmitting={isSubmitting} /></div>
            </div>)}
        </div>
    );
};

// --- User Role Management ---
const UserRoleManagement: React.FC<PageProps> = ({ setModal }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getUsersData();
            setUsers(data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    
    useEffect(() => { fetchData(); }, []);

    const handleUpdate = async (user: User, field: keyof User, value: any) => {
        setModal({ type: 'progress', props: { title: 'Updating...', message: 'Saving changes.' } });
        try {
            if (user.id) {
                await updateUser(user.id, { [field]: value });
                await fetchData();
            }
        } catch (e) {
            alert(`Error updating user: ${(e as Error).message}`);
        }
        setModal({ type: null, props: {} });
    };

    const handleAccessPageChange = async (user: User, pageId: string, checked: boolean) => {
        const currentPages = Array.isArray(user.accessPage) ? user.accessPage : (user.accessPage || '').split(',').map(p => p.trim()).filter(Boolean);
        const newPages = checked ? [...currentPages, pageId] : currentPages.filter(p => p !== pageId);
        await handleUpdate(user, 'accessPage', newPages.join(','));
    };

    return (
        <div>
            <h2 className="text-lg font-bold">Manage User Roles & Permissions</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Quickly adjust user roles and access rights.</p>
            <div className="overflow-x-auto"><table className="w-full text-left">
                <thead className="border-b border-inherit text-gray-500 dark:text-gray-400 text-sm">
                    <tr>
                        <th className="py-2 px-3 font-semibold">SN</th>
                        <th className="py-2 px-3 font-semibold">User</th>
                        <th className="py-2 px-3 font-semibold">Role</th>
                        <th className="py-2 px-3 font-semibold">Pro Access</th>
                        <th className="py-2 px-3 font-semibold">Accessible Pages</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {loading ? (<tr><td colSpan={5} className="text-center py-6"><div className="spinner mx-auto"></div></td></tr>)
                    : users.map((user, index) => (
                        <tr key={user.email} className="border-b border-inherit last:border-b-0">
                            <td className="py-3 px-3 text-gray-500 dark:text-gray-400">{index + 1}</td>
                            <td className="py-3 px-3 font-medium">{user.name}<br /><span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span></td>
                            <td className="py-3 px-3"><select value={user.role} onChange={e => handleUpdate(user, 'role', e.target.value)} className="p-1 text-sm"><option>User</option><option>Admin</option></select></td>
                            <td className="py-3 px-3"><input type="checkbox" checked={!!user.hasProAccess} onChange={e => handleUpdate(user, 'hasProAccess', e.target.checked)} className="h-4 w-4" /></td>
                            <td className="py-3 px-3">
                                <details>
                                    <summary className="cursor-pointer text-blue-600 hover:underline">View/Edit ({Array.isArray(user.accessPage) ? user.accessPage.length : user.accessPage.split(',').length})</summary>
                                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto p-2 border border-inherit rounded-md bg-gray-50 dark:bg-slate-800">
                                        {allPages.map(page => (
                                            <label key={page.id} className="flex items-center gap-2 text-sm">
                                                <input type="checkbox" checked={(Array.isArray(user.accessPage) ? user.accessPage : user.accessPage.split(',')).includes(page.id)} onChange={e => handleAccessPageChange(user, page.id, e.target.checked)} className="h-4 w-4" />
                                                {page.label}
                                            </label>
                                        ))}
                                    </div>
                                </details>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table></div>
        </div>
    );
};

// --- Main Form Management Page Component ---
const FormManagement: React.FC<PageProps> = ({ setModal, theme, refreshNotifications }) => {
    const [activeTab, setActiveTab] = useState('templates');

    const tabs = [
        { id: 'templates', label: 'Templates', icon: 'description' },
        { id: 'billing', label: 'Billing Plans', icon: 'credit_card' },
        { id: 'notifications', label: 'Notifications', icon: 'campaign' },
        { id: 'roles', label: 'User Roles', icon: 'manage_accounts' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'templates': return <TemplateManagement setModal={setModal} theme={theme} />;
            case 'billing': return <BillingManagement setModal={setModal} theme={theme} />;
            case 'notifications': return <NotificationManagement setModal={setModal} theme={theme} refreshNotifications={refreshNotifications} />;
            case 'roles': return <UserRoleManagement setModal={setModal} theme={theme} />;
            default: return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <span className="material-icons-outlined text-blue-600 dark:text-blue-500">dynamic_form</span>
                    Form Management
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-base">Central hub for managing templates, billing, and other system forms.</p>
            </div>

            <div className="card">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-8 px-6">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id ? 'border-blue-500 text-blue-600 dark:text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                <span className="material-icons-outlined text-base">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default FormManagement;
