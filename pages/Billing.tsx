import React, { useState, useEffect, useRef } from 'react';
import { PageProps, BillingPlan, PaymentHistory } from '../types';
import { getBillingPlansData, getPaymentHistoryData, sendPaymentConfirmation } from '../services/gasClient';

const PlanCard: React.FC<{ plan: BillingPlan, isCurrentUserPlan: boolean, onUpgrade: () => void }> = ({ plan, isCurrentUserPlan, onUpgrade }) => (
    <div className={`card flex flex-col p-6 rounded-xl ${isCurrentUserPlan ? 'border-2 border-blue-600' : ''}`}>
        <h2 className="text-xl font-bold">{plan.name}</h2>
        <div className="my-4">
            <span className="text-4xl font-extrabold">{typeof plan.price === 'number' ? `$${plan.price}` : plan.price}</span>
            {plan.pricePeriod && <span className="text-gray-500 dark:text-gray-400">{plan.pricePeriod}</span>}
        </div>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400 flex-grow mb-6">
            {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                    <span className="material-icons-outlined text-green-500 text-base">check_circle</span>
                    <span>{feature}</span>
                </li>
            ))}
        </ul>
        <button
            onClick={onUpgrade}
            className={`w-full font-semibold py-2.5 rounded-lg transition-colors ${isCurrentUserPlan ? 'btn-secondary cursor-default' : 'btn-primary'}`}
            disabled={isCurrentUserPlan}
        >
            {isCurrentUserPlan ? 'Your Current Plan' : plan.buttonText}
        </button>
    </div>
);

const FaqItem: React.FC<{ question: string, children: React.ReactNode }> = ({ question, children }) => (
    <details className="p-4 rounded-lg bg-gray-50 dark:bg-slate-800 border border-inherit cursor-pointer group">
        <summary className="font-semibold text-lg list-none flex justify-between items-center">
            {question}
            <span className="material-icons-outlined transition-transform duration-300 transform group-open:rotate-180">expand_more</span>
        </summary>
        <div className="mt-4 text-gray-600 dark:text-gray-400 prose dark:prose-invert max-w-none">
            {children}
        </div>
    </details>
);

const Billing: React.FC<PageProps> = ({ navigateTo, user }) => {
    const [plans, setPlans] = useState<BillingPlan[]>([]);
    const [history, setHistory] = useState<PaymentHistory[]>([]);
    const [loading, setLoading] = useState(true);

    const [id, setId] = useState(user?.email || '');
    const [transactionId, setTransactionId] = useState('');
    const [selectedPlan, setSelectedPlan] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState(0);

    // Initialize theme on component mount
    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = localStorage.theme;
        
        if (currentTheme === 'dark' || (!currentTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setScreenshot(e.target.files[0]);
             setSubmitStatus(null);
        }
    };

    const handleConfirmationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !transactionId || !selectedPlan || !amount || !paymentMethod || !screenshot) {
            setSubmitStatus({ message: 'Please fill all required fields and upload a screenshot.', type: 'error' });
            return;
        }
        setIsSubmitting(true);
        setSubmitStatus(null);
        try {
            await sendPaymentConfirmation({
                id,
                transactionId,
                plan: selectedPlan,
                amount: parseFloat(amount),
                paymentMethod,
                screenshotName: screenshot.name
            });
            setSubmitStatus({ message: 'Confirmation sent successfully! Your plan will be updated shortly.', type: 'success' });
            setId('');
            setTransactionId('');
            setSelectedPlan('');
            setAmount('');
            setPaymentMethod('');
            setScreenshot(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            setSubmitStatus({ message: `Submission failed. Please try again or contact support.`, type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (user?.email) {
            setId(user.email);
        }
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Only fetch billing plans, skip payment history for now
                const plansData = await getBillingPlansData();
                setPlans(plansData);
                setHistory([]); // Empty history for now
            } catch (err) {
                console.error("Failed to load billing data", err);
                // Use mock data as fallback
                const { MOCK_BILLING_PLANS } = await import('../types');
                setPlans(MOCK_BILLING_PLANS.filter(p => p.isActive !== false));
                setHistory([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold flex items-center justify-center gap-3 text-fb-text dark:text-fb-text-dark">
                    <span className="material-icons-outlined text-fb-primary">credit_card</span>
                    Billing & Plans
                </h1>
                <p className="text-fb-secondary dark:text-fb-secondary-dark mt-2 text-lg max-w-2xl mx-auto">Choose the perfect plan for your needs, manage your subscription, and track your payment history.</p>
            </div>

            {/* Current Plan Status */}
            {user && (
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                                {user.profilePictureUrl ? (
                                    <img 
                                        src={user.profilePictureUrl} 
                                        alt={user.name} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : user.profilePictureId ? (
                                    <img 
                                        src={`https://lh3.googleusercontent.com/d/${user.profilePictureId}`} 
                                        alt={user.name} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-fb-primary/10 flex items-center justify-center">
                                        <span className="material-icons-outlined text-fb-primary">account_circle</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-fb-text dark:text-fb-text-dark">{user.name}</h3>
                                <p className="text-fb-secondary dark:text-fb-secondary-dark">{user.email}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-fb-secondary dark:text-fb-secondary-dark">Current Plan</div>
                            <div className={`text-xl font-bold ${user.plan === 'Enterprise' ? 'text-purple-600' : user.plan === 'Pro' ? 'text-fb-primary' : 'text-fb-secondary dark:text-fb-secondary-dark'}`}>
                                {user.plan}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Pricing Plans */}
            <div className="max-w-7xl mx-auto py-12">
                

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="w-8 h-8 border-4 border-fb-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Free Plan */}
                        <div className="relative p-8 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.03] border-fb-border bg-white dark:bg-fb-dark-surface shadow-md hover:border-fb-primary">
                            {user?.plan === 'Free' && (
                                <div className="absolute -top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                                    Current Plan
                                </div>
                            )}
                            <div className="text-center">
                                <h3 className="text-2xl font-bold mb-2 text-fb-text dark:text-fb-text-dark">Free</h3>
                                <div className="mb-6 text-fb-text dark:text-fb-text-dark">
                                    <span className="text-5xl font-bold">$0</span>
                                    <span className="text-lg text-fb-secondary dark:text-fb-secondary-dark">/ mo</span>
                                </div>
                                <ul className="space-y-3 mb-8 text-left text-fb-secondary dark:text-fb-secondary-dark">
                                    <li className="flex items-start gap-3">
                                        <span className="material-icons-outlined text-sm text-green-500 mt-1">check_circle</span>
                                        <span>100 Merges/month</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-icons-outlined text-sm text-green-500 mt-1">check_circle</span>
                                        <span>Access to Free Templates</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-icons-outlined text-sm text-green-500 mt-1">check_circle</span>
                                        <span>Standard Support</span>
                                    </li>
                                </ul>
                                <button 
                                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                                        user?.plan === 'Free' 
                                            ? 'bg-gray-200 text-fb-secondary cursor-default opacity-80' 
                                            : 'btn-primary hover:scale-105'
                                    }`}
                                    onClick={() => user?.plan !== 'Free' && setSelectedPlan('Free')}
                                    disabled={user?.plan === 'Free'}
                                >
                                    {user?.plan === 'Free' ? 'Current Plan' : 'Select Free'}
                                </button>
                            </div>
                        </div>

                        {/* Pro Plan (Most Popular) */}
                        <div className="relative p-8 rounded-xl border-2 transition-all duration-300 hover:shadow-2xl hover:scale-[1.07] border-fb-primary bg-fb-primary text-white shadow-2xl scale-105">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-fb-primary text-white px-4 py-2 rounded-full text-sm font-semibold shadow-xl border border-white/30">
                                Most Popular
                            </div>
                            {user?.plan === 'Pro' && (
                                <div className="absolute -top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                                    Current Plan
                                </div>
                            )}
                            <div className="text-center">
                                <h3 className="text-2xl font-bold mb-2 text-white">Pro</h3>
                                <div className="mb-6 text-white">
                                    <span className="text-5xl font-bold">$15</span>
                                    <span className="text-lg text-white/80">/ mo</span>
                                </div>
                                <ul className="space-y-3 mb-8 text-left text-white/90">
                                    <li className="flex items-start gap-3">
                                        <span className="material-icons-outlined text-sm text-white mt-1">check_circle</span>
                                        <span>Unlimited Merges</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-icons-outlined text-sm text-white mt-1">check_circle</span>
                                        <span>Access to Pro Templates</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-icons-outlined text-sm text-white mt-1">check_circle</span>
                                        <span>Advanced Analytics & Reports</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-icons-outlined text-sm text-white mt-1">check_circle</span>
                                        <span>Priority Support</span>
                                    </li>
                                </ul>
                                <button 
                                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                                        user?.plan === 'Pro'
                                            ? 'bg-green-500 text-white cursor-default'
                                            : 'bg-white text-fb-primary hover:bg-gray-100 hover:scale-[1.02]'
                                    }`}
                                    onClick={() => user?.plan !== 'Pro' && setSelectedPlan('Pro')}
                                    disabled={user?.plan === 'Pro'}
                                >
                                    {user?.plan === 'Pro' ? 'Current Plan' : 'Upgrade to Pro'}
                                </button>
                            </div>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="relative p-8 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.03] border-fb-border dark:border-fb-secondary-dark bg-white dark:bg-fb-dark-surface shadow-md hover:border-fb-primary">
                            {user?.plan === 'Enterprise' && (
                                <div className="absolute -top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                                    Current Plan
                                </div>
                            )}
                            <div className="text-center">
                                <h3 className="text-2xl font-bold mb-2 text-fb-text dark:text-fb-text-dark">Enterprise</h3>
                                <div className="mb-6 text-fb-text dark:text-fb-text-dark">
                                    <span className="text-5xl font-bold">Contact Us</span>
                                </div>
                                <ul className="space-y-3 mb-8 text-left text-fb-secondary dark:text-fb-secondary-dark">
                                    <li className="flex items-start gap-3">
                                        <span className="material-icons-outlined text-sm text-green-500 mt-1">check_circle</span>
                                        <span>All Pro Features</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-icons-outlined text-sm text-green-500 mt-1">check_circle</span>
                                        <span>Admin Dashboard & Audit Logs</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-icons-outlined text-sm text-green-500 mt-1">check_circle</span>
                                        <span>Advanced User Management</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-icons-outlined text-sm text-green-500 mt-1">check_circle</span>
                                        <span>Dedicated Account Manager</span>
                                    </li>
                                </ul>
                                <button 
                                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                                        user?.plan === 'Enterprise'
                                            ? 'bg-green-500 text-white cursor-default'
                                            : 'btn-primary hover:scale-105 shadow-lg'
                                    }`}
                                    onClick={() => user?.plan !== 'Enterprise' && window.open('mailto:margeitpro@gmail.com?subject=Enterprise Plan Inquiry')}
                                    disabled={user?.plan === 'Enterprise'}
                                >
                                    {user?.plan === 'Enterprise' ? 'Current Plan' : 'Contact Sales'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Payment Section */}
            <div className="card p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-fb-text dark:text-fb-text-dark mb-2">Payment & Confirmation</h2>
                    <p className="text-fb-secondary dark:text-fb-secondary-dark">Complete your payment and confirm to activate your plan</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-fb-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                            <h3 className="text-xl font-semibold text-fb-text dark:text-fb-text-dark">Make Payment</h3>
                        </div>
                        <p className="text-fb-secondary dark:text-fb-secondary-dark mb-6">Choose your preferred payment method and complete the transaction.</p>
                        <div className="mb-6">
                            <div className="flex justify-center space-x-1 mb-6 bg-fb-light dark:bg-fb-dark p-1 rounded-lg">
                                {['NMB Bank', 'Khalti', 'Esewa'].map((tab, index) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(index)}
                                        className={`flex-1 px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 ${
                                            activeTab === index
                                                ? 'bg-fb-primary text-white shadow-md'
                                                : 'text-fb-secondary dark:text-fb-secondary-dark hover:text-fb-text dark:hover:text-fb-text-dark hover:bg-white dark:hover:bg-fb-surface'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="bg-white dark:bg-fb-surface p-4 rounded-lg border border-fb-border dark:border-fb-border-dark">
                                <img
                                    src={[
                                        'https://lh3.googleusercontent.com/pw/AP1GczPNELUf2BO0mRm4CUeESeNRSaGLbTluvy8hjJCHetKF3VbIg1uJZ6psbMyw6v6zfw7G8edVg_6i__m4QCdK_FcOqCpRZzkfK-xEoI6Hlh3xDU_eKA=w2400',
                                        'https://lh3.googleusercontent.com/pw/AP1GczOxFx_XdOSPJFNcJxCHkgJ1ENF1LQ3ECXkzK1s0aN0HjHRntgr9VZMY1AuudOEzyoz_3l7QSHo3dZz0nW6KTi_U5ZM0ipcN2zoUmiSmonxHJSqiIw=w2400',
                                        'https://lh3.googleusercontent.com/pw/AP1GczNnpICgehK9tF_5k3AGiZEiHBdqp9mTxZGxI_kk4W10dWs0sg3Hi8PlnyBNKFO_9NHFPt2HCPTorXbH3ohxeicLgslfNaMZBKZOi-d4zkjeIaaX1Q=w2400'
                                    ][activeTab]}
                                    alt={`${['NMB Bank', 'Khalti', 'Esewa'][activeTab]} Payment Method`}
                                    className="rounded-lg w-full max-h-60 object-contain mx-auto"
                                />
                            </div>
                        </div>
                        <div className="bg-fb-light dark:bg-fb-dark p-6 rounded-lg border border-fb-border dark:border-fb-border-dark">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="material-icons-outlined text-fb-primary">support_agent</span>
                                <h4 className="font-bold text-fb-text dark:text-fb-text-dark">Payment Support</h4>
                            </div>
                            <div className="space-y-2 text-sm text-fb-secondary dark:text-fb-secondary-dark">
                                <div className="flex items-center gap-2">
                                    <span className="material-icons-outlined text-xs">person</span>
                                    <span><strong>Developer:</strong> Man Singh Rana</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-icons-outlined text-xs">location_on</span>
                                    <span><strong>Address:</strong> Beldandi-5, Kanchanpur, Nepal</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-icons-outlined text-xs">phone</span>
                                    <span><strong>Contact:</strong> 9827792360 (WhatsApp)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-icons-outlined text-xs">email</span>
                                    <span><strong>Email:</strong> margeitpro@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleConfirmationSubmit} className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-fb-primary text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                            <h3 className="text-xl font-semibold text-fb-text dark:text-fb-text-dark">Confirm Payment</h3>
                        </div>
                        <p className="text-fb-secondary dark:text-fb-secondary-dark mb-6">Fill out this form after completing your payment to activate your plan.</p>

                        <div>
                            <label htmlFor="idInput" className="block text-sm font-medium mb-2 text-fb-text dark:text-fb-text-dark">Gmail ID</label>
                            <input
                                id="idInput"
                                type="text"
                                value={id}
                                onChange={e => {setId(e.target.value); setSubmitStatus(null);}}
                                placeholder="Your login Gmail ID"
                                className="w-full p-3 border border-fb-border dark:border-fb-border-dark rounded-lg bg-white dark:bg-fb-surface text-fb-text dark:text-fb-text-dark focus:ring-2 focus:ring-fb-primary focus:border-fb-primary"
                                required
                                readOnly
                            />
                        </div>

                        <div>
                            <label htmlFor="transactionIdInput" className="block text-sm font-medium mb-2 text-fb-text dark:text-fb-text-dark">Transaction ID</label>
                            <input
                                id="transactionIdInput"
                                type="text"
                                value={transactionId}
                                onChange={e => {setTransactionId(e.target.value); setSubmitStatus(null);}}
                                placeholder="Enter Transaction ID"
                                className="w-full p-3 border border-fb-border dark:border-fb-border-dark rounded-lg bg-white dark:bg-fb-surface text-fb-text dark:text-fb-text-dark focus:ring-2 focus:ring-fb-primary focus:border-fb-primary"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="planSelect" className="block text-sm font-medium mb-2 text-fb-text dark:text-fb-text-dark">Purchased Plan</label>
                            <select id="planSelect" value={selectedPlan} onChange={e => {setSelectedPlan(e.target.value); setSubmitStatus(null);}} className="w-full p-3 border border-fb-border dark:border-fb-border-dark rounded-lg bg-white dark:bg-fb-surface text-fb-text dark:text-fb-text-dark focus:ring-2 focus:ring-fb-primary focus:border-fb-primary" required>
                                <option value="" disabled>-- Choose a plan --</option>
                                {plans.filter(p => p.isActive !== false).map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="amountInput" className="block text-sm font-medium mb-2 text-fb-text dark:text-fb-text-dark">Amount Paid</label>
                            <input
                                id="amountInput"
                                type="number"
                                value={amount}
                                onChange={e => {setAmount(e.target.value); setSubmitStatus(null);}}
                                placeholder="Enter amount paid"
                                className="w-full p-3 border border-fb-border dark:border-fb-border-dark rounded-lg bg-white dark:bg-fb-surface text-fb-text dark:text-fb-text-dark focus:ring-2 focus:ring-fb-primary focus:border-fb-primary"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div>
                            <label htmlFor="paymentMethodSelect" className="block text-sm font-medium mb-2 text-fb-text dark:text-fb-text-dark">Payment Method</label>
                            <select id="paymentMethodSelect" value={paymentMethod} onChange={e => {setPaymentMethod(e.target.value); setSubmitStatus(null);}} className="w-full p-3 border border-fb-border dark:border-fb-border-dark rounded-lg bg-white dark:bg-fb-surface text-fb-text dark:text-fb-text-dark focus:ring-2 focus:ring-fb-primary focus:border-fb-primary" required>
                                <option value="" disabled>-- Choose payment method --</option>
                                <option value="NMB Bank">NMB Bank</option>
                                <option value="Khalti">Khalti</option>
                                <option value="Esewa">Esewa</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="screenshotUpload" className="block text-sm font-medium mb-2 text-fb-text dark:text-fb-text-dark">Payment Screenshot</label>
                            <div className="border-2 border-dashed border-fb-border dark:border-fb-border-dark rounded-lg p-6 text-center hover:border-fb-primary transition-colors">
                                <input
                                    ref={fileInputRef}
                                    id="screenshotUpload"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/png, image/jpeg, image/gif"
                                    className="hidden"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex flex-col items-center gap-2 w-full text-fb-secondary dark:text-fb-secondary-dark hover:text-fb-primary"
                                >
                                    <span className="material-icons-outlined text-3xl">cloud_upload</span>
                                    <span className="font-medium">
                                        {screenshot ? screenshot.name : 'Click to upload screenshot'}
                                    </span>
                                    <span className="text-xs">PNG, JPG, GIF up to 10MB</span>
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full py-3 text-lg font-semibold" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Submitting...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <span className="material-icons-outlined">check_circle</span>
                                    Confirm Payment
                                </div>
                            )}
                        </button>

                        {submitStatus && (
                             <div className={`p-3 rounded-md text-sm text-center ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                {submitStatus.message}
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Payment History */}
            <div className="card p-8">
                <div className="flex items-center gap-3 mb-6">
                    <span className="material-icons-outlined text-fb-primary">history</span>
                    <h2 className="text-2xl font-bold text-fb-text dark:text-fb-text-dark">Payment History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-fb-border dark:border-fb-border-dark">
                                <th className="py-4 px-4 text-left font-semibold text-fb-text dark:text-fb-text-dark">Gmail ID</th>
                                <th className="py-4 px-4 text-left font-semibold text-fb-text dark:text-fb-text-dark">Transaction ID</th>
                                <th className="py-4 px-4 text-left font-semibold text-fb-text dark:text-fb-text-dark">Plan</th>
                                <th className="py-4 px-4 text-left font-semibold text-fb-text dark:text-fb-text-dark">Payment Method</th>
                                <th className="py-4 px-4 text-left font-semibold text-fb-text dark:text-fb-text-dark">Status</th>
                                <th className="py-4 px-4 text-left font-semibold text-fb-text dark:text-fb-text-dark">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <div className="w-8 h-8 border-4 border-fb-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    </td>
                                </tr>
                            ) : history.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="material-icons-outlined text-4xl text-fb-secondary dark:text-fb-secondary-dark">receipt_long</span>
                                            <p className="text-fb-secondary dark:text-fb-secondary-dark">No payment history found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                history.map((item, index) => (
                                    <tr key={item.id || index} className="border-b border-fb-border dark:border-fb-border-dark hover:bg-fb-hover dark:hover:bg-fb-hover-dark transition-colors">
                                        <td className="py-4 px-4 font-medium text-fb-text dark:text-fb-text-dark">{item.gmailId}</td>
                                        <td className="py-4 px-4 text-fb-secondary dark:text-fb-secondary-dark font-mono text-sm">{item.transactionId}</td>
                                        <td className="py-4 px-4 text-fb-text dark:text-fb-text-dark font-medium">{item.plan}</td>
                                        <td className="py-4 px-4 text-fb-secondary dark:text-fb-secondary-dark">{item.paymentMethod || 'N/A'}</td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
                                                item.status === 'Success' 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                                    : item.status === 'Pending' 
                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' 
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                            }`}>
                                                <span className={`w-2 h-2 rounded-full ${
                                                    item.status === 'Success' ? 'bg-green-500' : item.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}></span>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-fb-secondary dark:text-fb-secondary-dark">{new Date(item.timestamp).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Help & Support */}
            <div className="card p-8">
                <div className="flex items-center gap-3 mb-8">
                    <span className="material-icons-outlined text-fb-primary">help</span>
                    <h2 className="text-3xl font-bold text-fb-text dark:text-fb-text-dark">Help & Support</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-2xl font-bold text-fb-text dark:text-fb-text-dark">Frequently Asked Questions</h3>
                        <FaqItem question="How do I find my Google Sheet or Doc/Slides ID?">
                            <p>The ID is the long string of random characters in the URL of your Google file.</p>
                            <p>For example, in <code>https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit</code>, the ID is "THIS_IS_THE_ID".</p>
                        </FaqItem>
                        <FaqItem question="Why are my merge fields not working?">
                            <p>This is the most common issue. Ensure the placeholder in your template (e.g., <code>{`{{Column_Name}}`}</code>) <strong>exactly</strong> matches the column header in your Google Sheet. It's case-sensitive and space-sensitive.</p>
                        </FaqItem>
                        <FaqItem question="Can I merge images?">
                            <p>Yes! Simply put a publicly accessible URL to an image in your Google Sheet cell. The merge process will fetch the image and place it in your document.</p>
                        </FaqItem>
                         <FaqItem question="What's the difference between 'All in One' and 'Custom' merge?">
                            <ul>
                                <li><strong>All In One:</strong> Takes all your specified rows and creates a single output file. For Slides, it creates one slide per row. For Docs, it appends the content for each row.</li>
                                <li><strong>Custom:</strong> Creates a separate, individual file for each row of data in your sheet.</li>
                            </ul>
                        </FaqItem>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-fb-light dark:bg-fb-dark p-6 rounded-lg text-center border border-fb-border dark:border-fb-border-dark">
                            <span className="material-icons-outlined text-4xl text-fb-primary mb-3 block">menu_book</span>
                            <h3 className="text-xl font-bold text-fb-text dark:text-fb-text-dark mb-2">Documentation</h3>
                            <p className="text-sm text-fb-secondary dark:text-fb-secondary-dark mb-4">Detailed guides and tutorials for all features</p>
                            <button onClick={() => navigateTo && navigateTo('help')} className="btn btn-primary w-full">
                                View Documentation
                            </button>
                        </div>
                        <div className="bg-fb-light dark:bg-fb-dark p-6 rounded-lg text-center border border-fb-border dark:border-fb-border-dark">
                            <span className="material-icons-outlined text-4xl text-green-500 mb-3 block">support_agent</span>
                            <h3 className="text-xl font-bold text-fb-text dark:text-fb-text-dark mb-2">Contact Support</h3>
                            <p className="text-sm text-fb-secondary dark:text-fb-secondary-dark mb-4">Get help from our support team</p>
                            <a href="mailto:margeitpro@gmail.com" className="btn btn-secondary w-full">
                                Email Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dark Mode Toggle */}
            <div className="text-center mt-12">
                <button 
                    onClick={() => {
                        const html = document.documentElement;
                        const isDark = html.classList.toggle('dark');
                        localStorage.theme = isDark ? 'dark' : 'light';
                    }}
                    className="text-fb-primary dark:text-fb-text-dark text-sm font-medium hover:underline flex items-center justify-center mx-auto p-2 rounded-lg transition duration-300"
                >
                    <span className="material-icons-outlined text-lg mr-2">
                        brightness_6
                    </span>
                    Toggle Dark Mode
                </button>
            </div>
        </div>
    );
};

export default Billing;