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
                const [plansData, historyData] = await Promise.all([
                    getBillingPlansData(),
                    getPaymentHistoryData(),
                ]);
                setPlans(plansData);
                setHistory(historyData);
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
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <span className="material-icons-outlined text-blue-600 dark:text-blue-500">credit_card</span>
                    Billing & Plans
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-base">Manage your subscription, view payment history, and find help & support.</p>
            </div>

            <div className="card p-6 lg:p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Choose the plan that's right for you</h2>
                {loading ? (
                     <div className="flex justify-center items-center h-40"><div className="spinner"></div></div>
                ) : (
                    <div className={`grid gap-8 max-w-5xl mx-auto ${plans.filter(p => p.isActive !== false).length === 1 ? 'grid-cols-1' : plans.filter(p => p.isActive !== false).length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
                        {plans.filter(p => p.isActive !== false).map((plan, index) => (
                            <div key={plan.id} className={`p-8 rounded-2xl border shadow-sm text-center ${index === 1 ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg relative' : 'bg-white text-slate-900 border-slate-200'}`}>
                                {index === 1 && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</div>}
                                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                                <div className="text-4xl font-bold mb-2">{typeof plan.price === 'number' ? `${plan.currency === 'NPR' ? 'रू' : plan.currency === 'INR' ? '₹' : '$'}${plan.price}` : plan.price}{plan.pricePeriod && <span className="text-lg font-normal opacity-80">/{plan.pricePeriod}</span>}</div>
                                <ul className={`${index === 1 ? 'opacity-90' : 'text-slate-600'} mb-6 space-y-2`}>
                                    {plan.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                                <button
                                    className={`w-full font-semibold py-2.5 rounded-lg transition-colors ${index === 1 ? 'bg-white text-indigo-600 hover:bg-slate-50' : 'btn-primary'}`}
                                    onClick={() => setSelectedPlan(plan.name)}
                                >
                                    {plan.buttonText || 'Select Plan'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="card p-6 lg:p-8">
                <h2 className="text-2xl font-bold mb-6">Payment Method & Confirmation</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">1. Make Payment</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Complete your payment using the method below.</p>
                        <div className="mb-4">
                            <div className="flex justify-center space-x-2 mb-4">
                                {['NMB Bank', 'Khalti', 'Esewa'].map((tab, index) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(index)}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                            activeTab === index
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <img
                                src={[
                                    'https://lh3.googleusercontent.com/pw/AP1GczPNELUf2BO0mRm4CUeESeNRSaGLbTluvy8hjJCHetKF3VbIg1uJZ6psbMyw6v6zfw7G8edVg_6i__m4QCdK_FcOqCpRZzkfK-xEoI6Hlh3xDU_eKA=w2400',
                                    'https://lh3.googleusercontent.com/pw/AP1GczOxFx_XdOSPJFNcJxCHkgJ1ENF1LQ3ECXkzK1s0aN0HjHRntgr9VZMY1AuudOEzyoz_3l7QSHo3dZz0nW6KTi_U5ZM0ipcN2zoUmiSmonxHJSqiIw=w2400',
                                    'https://lh3.googleusercontent.com/pw/AP1GczNnpICgehK9tF_5k3AGiZEiHBdqp9mTxZGxI_kk4W10dWs0sg3Hi8PlnyBNKFO_9NHFPt2HCPTorXbH3ohxeicLgslfNaMZBKZOi-d4zkjeIaaX1Q=w2400'
                                ][activeTab]}
                                alt={`${['NMB Bank', 'Khalti', 'Esewa'][activeTab]} Payment Method`}
                                className="rounded-lg border border-inherit w-full max-h-60 object-contain mx-auto"
                            />
                        </div>
                        <div className="text-sm p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-inherit">
                            <h4 className="font-bold mb-2">Payment Support</h4>
                            <p><strong className="w-24 inline-block">Developer:</strong> Man Singh Rana</p>
                            <p><strong className="w-24 inline-block">Address:</strong> Beldandi-5, Kanchanpur, Nepal</p>
                            <p><strong className="w-24 inline-block">Contact:</strong> 9827792360 (WhatsApp)</p>
                            <p><strong className="w-24 inline-block">Email:</strong> margeitpro@gmail.com</p>
                        </div>
                    </div>

                    <form onSubmit={handleConfirmationSubmit} className="space-y-4">
                        <h3 className="text-xl font-semibold mb-2">2. Confirm Your Payment</h3>
                        <p className="text-gray-500 dark:text-gray-400 !mb-4">After payment, fill out this form to activate your plan.</p>

                        <div>
                            <label htmlFor="idInput" className="block text-sm font-medium mb-1">ID (Login Gmail)</label>
                            <input
                                id="idInput"
                                type="text"
                                value={id}
                                onChange={e => {setId(e.target.value); setSubmitStatus(null);}}
                                placeholder="Your login Gmail ID"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                                readOnly
                            />
                        </div>

                        <div>
                            <label htmlFor="transactionIdInput" className="block text-sm font-medium mb-1">Transaction ID</label>
                            <input
                                id="transactionIdInput"
                                type="text"
                                value={transactionId}
                                onChange={e => {setTransactionId(e.target.value); setSubmitStatus(null);}}
                                placeholder="Enter Transaction ID"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="planSelect" className="block text-sm font-medium mb-1">Select Purchased Plan</label>
                            <select id="planSelect" value={selectedPlan} onChange={e => {setSelectedPlan(e.target.value); setSubmitStatus(null);}} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
                                <option value="" disabled>-- Choose a plan --</option>
                                {plans.filter(p => p.isActive !== false).map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="amountInput" className="block text-sm font-medium mb-1">Amount Paid</label>
                            <input
                                id="amountInput"
                                type="number"
                                value={amount}
                                onChange={e => {setAmount(e.target.value); setSubmitStatus(null);}}
                                placeholder="Enter amount paid"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div>
                            <label htmlFor="paymentMethodSelect" className="block text-sm font-medium mb-1">Payment Method</label>
                            <select id="paymentMethodSelect" value={paymentMethod} onChange={e => {setPaymentMethod(e.target.value); setSubmitStatus(null);}} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
                                <option value="" disabled>-- Choose payment method --</option>
                                <option value="NMB Bank">NMB Bank</option>
                                <option value="Khalti">Khalti</option>
                                <option value="Esewa">Esewa</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="screenshotUpload" className="block text-sm font-medium mb-1">Upload Payment Screenshot</label>
                            <input
                                ref={fileInputRef}
                                id="screenshotUpload"
                                type="file"
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg, image/gif"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-700 dark:file:text-slate-300 dark:hover:file:bg-slate-600"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-full !mt-6" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Confirm Payment'}
                        </button>

                        {submitStatus && (
                             <div className={`p-3 rounded-md text-sm text-center ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                {submitStatus.message}
                            </div>
                        )}
                    </form>
                </div>
            </div>

            <div className="card p-6 lg:p-8">
                <h2 className="text-2xl font-bold mb-6">Payment History</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-inherit text-gray-500 dark:text-gray-400 text-sm">
                            <tr>
                                <th className="py-3 px-4 font-semibold">Gmail ID</th>
                                <th className="py-3 px-4 font-semibold">Transaction ID</th>
                                <th className="py-3 px-4 font-semibold">Plan</th>
                                <th className="py-3 px-4 font-semibold">Payment Method</th>
                                <th className="py-3 px-4 font-semibold">Status</th>
                                <th className="py-3 px-4 font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-8"><div className="spinner mx-auto"></div></td></tr>
                            ) : history.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No payment history found.</td></tr>
                            ) : (
                                history.map((item, index) => (
                                    <tr key={item.id || index} className="border-b border-inherit last:border-b-0">
                                        <td className="py-4 px-4 font-medium">{item.gmailId}</td>
                                        <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{item.transactionId}</td>
                                        <td className="py-4 px-4">{item.plan}</td>
                                        <td className="py-4 px-4">{item.paymentMethod || 'N/A'}</td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${item.status === 'Success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{new Date(item.timestamp).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Help Content --- */}
            <div className="pt-8 border-t border-inherit">
                 <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
                    <span className="material-icons-outlined text-blue-600 dark:text-blue-500">help</span>
                    Help & Support
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
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
                        <div className="card p-6 text-center">
                            <span className="material-icons-outlined text-4xl text-blue-500">menu_book</span>
                            <h3 className="text-xl font-bold mt-2">Read the Docs</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">For detailed guides and tutorials, check out our full documentation.</p>
                            <button onClick={() => navigateTo && navigateTo('documentation')} className="btn btn-primary w-full">View Documentation</button>
                        </div>
                        <div className="card p-6 text-center">
                            <span className="material-icons-outlined text-4xl text-green-500">support_agent</span>
                            <h3 className="text-xl font-bold mt-2">Contact Support</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">Can't find an answer? Our support team is here to help.</p>
                            <a href="mailto:support@margeitpro.com" className="btn btn-secondary w-full">Email Support</a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Billing;