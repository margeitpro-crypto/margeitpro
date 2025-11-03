import React, { useRef, useEffect, useState } from 'react';
import { getBillingPlansData } from '../services/gasClient';
import { BillingPlan } from '../types';

// Reusable components for the landing page

const NavLink: React.FC<{ href: string, children: React.ReactNode, onClick?: () => void }> = ({ href, children, onClick }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (onClick) {
            onClick();
        } else {
            const targetId = href.replace('#', '');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <a href={href} onClick={handleClick} className="text-slate-600 hover:text-slate-900 transition-colors font-medium cursor-pointer">
            {children}
        </a>
    );
};

const CtaButton: React.FC<{ href: string, children: React.ReactNode, primary?: boolean, className?: string }> = ({ href, children, primary = false, className = '' }) => (
    <a href={href} className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all duration-300 ${primary ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/40' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'} ${className}`}>
        {children}
    </a>
);

const Section = React.forwardRef<HTMLElement, { children: React.ReactNode, className?: string, isGray?: boolean, id?: string }>(({ children, className = '', isGray = false, id }, ref) => (
    <section ref={ref} id={id} className={`py-8 md:py-16 ${isGray ? 'bg-slate-50' : 'bg-white'} ${className}`} style={id ? { scrollMarginTop: '5rem' } : {}}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {children}
        </div>
    </section>
));

const SectionTitle: React.FC<{ title: string, subtitle: string }> = ({ title, subtitle }) => (
    <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">{title}</h2>
        <p className="mt-4 text-lg text-slate-600">{subtitle}</p>
    </div>
);

const FeatureCard: React.FC<{ icon: string, title: string, description: string, color?: string }> = ({ icon, title, description, color = "text-indigo-600" }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-5">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className={`material-icons-outlined text-3xl ${color}`}>{icon}</span>
            </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600">{description}</p>
    </div>
);

const StepCard: React.FC<{ number: string, title: string, description: string }> = ({ number, title, description }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-12 h-12 bg-indigo-600 text-white text-2xl font-bold rounded-full flex items-center justify-center mb-4">
            {number}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600">{description}</p>
    </div>
);

const RoleCard: React.FC<{ icon: string, title: string, description: string, color?: string }> = ({ icon, title, description, color = "text-indigo-600" }) => (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className={`material-icons-outlined text-4xl ${color}`}>{icon}</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600">{description}</p>
    </div>
);

const TestimonialCard: React.FC<{ quote: string, name: string, role: string, avatar: string }> = ({ quote, name, role, avatar }) => (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-slate-700 mb-6 text-lg">"{quote}"</p>
        <div className="flex items-center gap-4">
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover"/>
            <div>
                <p className="font-bold text-slate-900">{name}</p>
                <p className="text-slate-600">{role}</p>
            </div>
        </div>
    </div>
);

const ReviewCard: React.FC<{ quote: string, name: string, role: string, avatar: string, rating: number }> = ({ quote, name, role, avatar, rating }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-w-[320px] max-w-[320px]">
        <div className="flex items-center mb-4">
            {[...Array(rating)].map((_, i) => (
                <span key={i} className="material-icons-outlined text-yellow-400 text-lg">star</span>
            ))}
        </div>
        <p className="text-slate-700 mb-4 text-base">"{quote}"</p>
        <div className="flex items-center gap-3">
            <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover"/>
            <div>
                <p className="font-bold text-slate-900 text-sm">{name}</p>
                <p className="text-slate-600 text-xs">{role}</p>
            </div>
        </div>
    </div>
);


const HomePage: React.FC<{ navigateTo?: (page: string) => void }> = ({ navigateTo }) => {
    const featuresRef = useRef<HTMLElement>(null);
    const planRef = useRef<HTMLElement>(null);
    const howItWorksRef = useRef<HTMLElement>(null);
    const useCasesRef = useRef<HTMLElement>(null);
    const schoolsRef = useRef<HTMLDivElement>(null);
    const companiesRef = useRef<HTMLDivElement>(null);
    const [billingPlans, setBillingPlans] = useState<BillingPlan[]>([]);
    const [loadingPlans, setLoadingPlans] = useState(true);

    const scrollToSection = (sectionRef: React.RefObject<HTMLElement>) => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchBillingPlans = async () => {
            try {
                // For unauthenticated users, use mock data directly
                const { MOCK_BILLING_PLANS } = await import('../types');
                setBillingPlans(MOCK_BILLING_PLANS
                    .filter(plan => plan.isActive !== false)
                    .sort((a, b) => (a.order || 999) - (b.order || 999)));
            } catch (error) {
                console.error('Error loading billing plans:', error);
                setBillingPlans([]);
            } finally {
                setLoadingPlans(false);
            }
        };

        fetchBillingPlans();

        const schoolsInterval = setInterval(() => {
            if (schoolsRef.current) {
                schoolsRef.current.scrollLeft += 1;
                if (schoolsRef.current.scrollLeft >= schoolsRef.current.scrollWidth - schoolsRef.current.clientWidth) {
                    schoolsRef.current.scrollLeft = 0;
                }
            }
        }, 100);

        const companiesInterval = setInterval(() => {
            if (companiesRef.current) {
                companiesRef.current.scrollLeft += 1;
                if (companiesRef.current.scrollLeft >= companiesRef.current.scrollWidth - companiesRef.current.clientWidth) {
                    companiesRef.current.scrollLeft = 0;
                }
            }
        }, 100);

        return () => {
            clearInterval(schoolsInterval);
            clearInterval(companiesInterval);
        };
    }, []);

    return (
        <div className="bg-white text-slate-800 antialiased">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <a href="#" className="flex items-center gap-2">
                            <span className="material-icons-outlined text-4xl text-indigo-600">bolt</span>
                            <span className="text-2xl font-bold tracking-tight text-slate-900">Marge It Pro</span>
                        </a>
                        <nav className="hidden md:flex items-center gap-8">
                            <button onClick={() => scrollToSection(featuresRef)} className="text-slate-600 hover:text-slate-900 transition-colors font-medium cursor-pointer">Features</button>
                            <button onClick={() => scrollToSection(planRef)} className="text-slate-600 hover:text-slate-900 transition-colors font-medium cursor-pointer">Pricing</button>
                            <button onClick={() => scrollToSection(howItWorksRef)} className="text-slate-600 hover:text-slate-900 transition-colors font-medium cursor-pointer">How It Works</button>
                            <button onClick={() => scrollToSection(useCasesRef)} className="text-slate-600 hover:text-slate-900 transition-colors font-medium cursor-pointer">Use Cases</button>
                        </nav>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <a href="#login" className="hidden sm:inline-block text-slate-600 hover:text-slate-900 font-semibold transition-colors">Login</a>
                            <CtaButton href="#login" primary className="px-4 py-2 text-sm">
                                Get Started
                            </CtaButton>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="pt-40 pb-16 text-center bg-gradient-to-br from-indigo-50 to-blue-100">
                    <div className="max-w-4xl mx-auto px-6 lg:px-8">
                        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <span className="material-icons-outlined text-lg">auto_awesome</span>
                            <span>Trusted by 500+ Schools & Companies</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
                            Automate Your Document Creation <span className="text-indigo-600">Effortlessly</span>
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-slate-700 max-w-3xl mx-auto">
                            Marge It Pro seamlessly merges data from Google Sheets into beautiful Google Docs and Slides, 
                            saving you <span className="font-bold text-indigo-600">hours of manual work</span> every week.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <CtaButton href="#login" primary className="text-lg px-8 py-4">
                                Start Free Trial <span className="material-icons-outlined text-xl ml-2">arrow_forward</span>
                            </CtaButton>
                            <CtaButton href="#features" className="text-lg px-8 py-4">
                                See How It Works
                            </CtaButton>
                        </div>
                        <div className="mt-12 relative">
                            <div className="absolute inset-0 bg-indigo-200 rounded-2xl transform rotate-3"></div>
                            <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 p-1">
                                <img 
                                    src="https://placehold.co/1200x600/4f46e5/ffffff?text=Merge+Documents+in+Seconds" 
                                    alt="Marge It Pro Dashboard" 
                                    className="w-full h-auto rounded-xl object-cover"
                                    onError={(e) => e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiM0ZjQ2ZTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRleHQgeD0iNjAwIiB5PSIzMDAiIGZvbnQtc2l6ZT0iMzIiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1lcmdlIERvY3VtZW50cyBpbiBTZWNvbmRzPC90ZXh0Pjwvc3ZnPg=='}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <Section isGray>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-indigo-600">10K+</div>
                            <div className="text-slate-600 mt-2">Documents Created</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-indigo-600">500+</div>
                            <div className="text-slate-600 mt-2">Trusted Users</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-indigo-600">99.9%</div>
                            <div className="text-slate-600 mt-2">Uptime</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-indigo-600">24/7</div>
                            <div className="text-slate-600 mt-2">Support</div>
                        </div>
                    </div>
                </Section>

                {/* Features Section */}
                <Section id="features" ref={featuresRef}>
                    <SectionTitle
                        title="Powerful Features for Effortless Automation"
                        subtitle="Discover how Marge It Pro transforms your document workflow with cutting-edge technology."
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                         <FeatureCard icon="grid_on" title="Sheet to Slides" description="Effortlessly merge data from Google Sheets into stunning presentations in Google Slides." color="text-blue-600" />
                         <FeatureCard icon="article" title="Sheet to Docs" description="Generate personalized documents in Google Docs from your spreadsheet data in seconds." color="text-green-600" />
                         <FeatureCard icon="layers" title="Template Management" description="Manage your Google Docs and Slides templates directly within the application for easy access." color="text-purple-600" />
                         <FeatureCard icon="auto_awesome" title="AI-Powered Assistance" description="Utilize GenAI to suggest templates, match data fields, and auto-populate documents." color="text-orange-600" />
                    </div>
                    
                    {/* Additional Feature Highlights */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                <span className="material-icons-outlined text-indigo-600 text-2xl">bolt</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Lightning Fast</h3>
                            <p className="text-slate-600">Generate hundreds of documents in seconds, not hours. Our optimized system ensures rapid processing.</p>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                <span className="material-icons-outlined text-indigo-600 text-2xl">security</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Secure & Private</h3>
                            <p className="text-slate-600">Your data never leaves Google's secure environment. We only facilitate the merging process.</p>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                <span className="material-icons-outlined text-indigo-600 text-2xl">sync</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Seamless Integration</h3>
                            <p className="text-slate-600">Works perfectly with your existing Google Workspace tools without any disruption.</p>
                        </div>
                    </div>
                </Section>

                {/* How it Works Section */}
                <Section id="how-it-works" isGray ref={howItWorksRef}>
                    <SectionTitle
                        title="Simple Steps to Success"
                        subtitle="Transform your document workflow in just three easy steps."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         <StepCard number="1" title="Connect Your Data" description="Provide the ID of your Google Sheet and specify the data range you want to use."/>
                         <StepCard number="2" title="Choose Your Template" description="Select a pre-made Google Docs or Slides template, or use your own by providing its ID."/>
                         <StepCard number="3" title="Merge with a Click" description="Click 'Marge It' and let our system generate your documents or presentations automatically."/>
                    </div>
                    
                    {/* Process Visualization */}
                    <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-8">
                        <h3 className="text-2xl font-bold text-center text-slate-900 mb-8">See It In Action</h3>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex-1 text-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-icons-outlined text-green-600 text-4xl">grid_on</span>
                                </div>
                                <h4 className="font-bold text-lg mb-2">Your Data</h4>
                                <p className="text-slate-600 text-sm">Google Sheet with student information</p>
                            </div>
                            <div className="text-indigo-500">
                                <span className="material-icons-outlined text-4xl">arrow_forward</span>
                            </div>
                            <div className="flex-1 text-center">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-icons-outlined text-blue-600 text-4xl">description</span>
                                </div>
                                <h4 className="font-bold text-lg mb-2">Your Template</h4>
                                <p className="text-slate-600 text-sm">Certificate or report template</p>
                            </div>
                            <div className="text-indigo-500">
                                <span className="material-icons-outlined text-4xl">arrow_forward</span>
                            </div>
                            <div className="flex-1 text-center">
                                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-icons-outlined text-purple-600 text-4xl">file_copy</span>
                                </div>
                                <h4 className="font-bold text-lg mb-2">Generated Files</h4>
                                <p className="text-slate-600 text-sm">Personalized documents for each entry</p>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Use Cases/Roles Section */}
                <Section id="use-cases" ref={useCasesRef}>
                    <SectionTitle
                        title="Perfect for Every Industry"
                        subtitle="From education to business, Marge It Pro adapts to your unique needs."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         <RoleCard icon="school" title="Educators" description="Create custom certificates, report cards, and personalized feedback for hundreds of students in minutes." color="text-blue-600" />
                         <RoleCard icon="work" title="Business Professionals" description="Generate sales proposals, contracts, invoices, and client reports with zero manual effort." color="text-green-600" />
                         <RoleCard icon="groups" title="HR Teams" description="Automate offer letters, employee contracts, onboarding documents, and performance reviews." color="text-purple-600" />
                    </div>
                    
                    {/* Industry Specific Benefits */}
                    <div className="mt-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
                        <div className="max-w-4xl mx-auto">
                            <h3 className="text-2xl font-bold mb-6 text-center">Why Industry Leaders Choose Marge It Pro</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons-outlined text-lg">check</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Save 10+ Hours Weekly</h4>
                                        <p className="opacity-90">Automate repetitive document creation tasks and focus on strategic work.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons-outlined text-lg">check</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Zero Errors</h4>
                                        <p className="opacity-90">Eliminate manual data entry mistakes with automated merging.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons-outlined text-lg">check</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Professional Results</h4>
                                        <p className="opacity-90">Create consistent, branded documents that impress clients and stakeholders.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons-outlined text-lg">check</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Scalable Solution</h4>
                                        <p className="opacity-90">Handle projects of any size, from 10 to 10,000+ documents.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Plan Section */}
                <Section id="plan" isGray ref={planRef}>
                    <SectionTitle
                        title="Simple, Transparent Pricing"
                        subtitle="Choose the plan that fits your document automation needs."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto" id="billing-plans-container">
                        {loadingPlans ? (
                            <div className="col-span-full flex justify-center py-12">
                                <div className="spinner"></div>
                            </div>
                        ) : billingPlans.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-slate-600">No billing plans available at the moment.</p>
                            </div>
                        ) : (
                            billingPlans.map((plan, index) => (
                                <div key={plan.id} className={`p-8 rounded-2xl border shadow-sm text-center relative overflow-hidden ${index === 1 ? 'bg-gradient-to-br from-indigo-600 to-purple-700 border-indigo-600 shadow-lg text-white transform scale-105 z-10' : 'bg-white border-slate-200'}`}>
                                    {index === 1 && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-semibold">Most Popular</div>
                                    )}
                                    <h3 className={`text-2xl font-bold mb-4 ${index === 1 ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                                    <div className={`text-4xl font-bold mb-2 ${index === 1 ? 'text-white' : 'text-slate-900'}`}>
                                        {typeof plan.price === 'number' ? `${plan.currency === 'NPR' ? 'रू' : plan.currency === 'INR' ? '₹' : '$'}${plan.price}` : plan.price}
                                        {plan.pricePeriod && <span className={`text-lg font-normal ${index === 1 ? 'opacity-80' : 'text-slate-600'}`}>{plan.pricePeriod}</span>}
                                    </div>
                                    <ul className={`mb-6 space-y-2 ${index === 1 ? 'opacity-90' : 'text-slate-600'}`}>
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className={`material-icons-outlined text-sm mt-0.5 ${index === 1 ? 'text-green-300' : 'text-green-500'}`}>check_circle</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <CtaButton
                                        href="#login"
                                        primary={index !== 1}
                                        className={`w-full ${index === 1 ? 'bg-white text-indigo-600 hover:bg-slate-50 font-bold' : ''}`}
                                    >
                                        {plan.buttonText}
                                    </CtaButton>
                                </div>
                            ))
                        )}
                    </div>
                    
                    {/* FAQ Section */}
                    <div className="mt-16 max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold text-center text-slate-900 mb-8">Frequently Asked Questions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-lg mb-2">Is my data secure?</h4>
                                <p className="text-slate-600">Absolutely. We never store your document data. All processing happens in real-time through Google's secure APIs.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-lg mb-2">Can I use my own templates?</h4>
                                <p className="text-slate-600">Yes! You can use any Google Docs or Slides template. Just provide the document ID and we'll do the rest.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-lg mb-2">How many documents can I create?</h4>
                                <p className="text-slate-600">Our Pro plan supports unlimited documents. Free plan includes 100 merges per month.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-lg mb-2">Do I need technical skills?</h4>
                                <p className="text-slate-600">Not at all. Our intuitive interface makes document automation accessible to everyone.</p>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Testimonials Section */}
                <Section>
                     <SectionTitle
                        title="Loved by Professionals Worldwide"
                        subtitle="Join thousands of satisfied users who have transformed their document workflow."
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <TestimonialCard
                            quote="Marge It Pro has saved our team countless hours. What used to take a full day of copying and pasting now takes minutes. As both a Designer & Developer and HR Executive, I use it for creating project documentation and onboarding new employees. It's a game-changer for our workflow!"
                            name="Man Singh Rana"
                            role="Designer, Developer & HR Executive"
                            avatar="https://lh3.googleusercontent.com/pw/AP1GczNBafUwK_kk9w-_61hgYeiqwWXCg-0BLU3w88BvcUAed3ts02C4ylZ6f5EITTn5Q71hvH7Rv0H77Guay5eSDaOroRpyhlYXQqcgf6Sst1a1KYyoLg=w2400"
                        />
                        <TestimonialCard
                            quote="As an educator, I create hundreds of report cards each semester. Marge It Pro has reduced my workload by 80% and eliminated all data entry errors."
                            name="Dr. Priya Sharma"
                            role="Principal, Delhi Public School"
                            avatar="https://randomuser.me/api/portraits/women/44.jpg"
                        />
                    </div>
                    
                    {/* Global Impact Section */}
                    <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                        <div className="text-center max-w-3xl mx-auto">
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Trusted by Professionals Across 15+ Countries</h3>
                            <p className="text-slate-600 mb-8">From startups in Silicon Valley to educational institutions in Nepal, Marge It Pro is helping professionals save time and reduce errors worldwide.</p>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                                        <span className="text-2xl">🇺🇸</span>
                                    </div>
                                    <span className="text-sm text-slate-600">USA</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                                        <span className="text-2xl">🇬🇧</span>
                                    </div>
                                    <span className="text-sm text-slate-600">UK</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                                        <span className="text-2xl">🇳🇵</span>
                                    </div>
                                    <span className="text-sm text-slate-600">Nepal</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                                        <span className="text-2xl">🇮🇳</span>
                                    </div>
                                    <span className="text-sm text-slate-600">India</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                                        <span className="text-2xl">🇦🇺</span>
                                    </div>
                                    <span className="text-sm text-slate-600">Australia</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                                        <span className="text-2xl">🇨🇦</span>
                                    </div>
                                    <span className="text-sm text-slate-600">Canada</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Additional Testimonials Carousel */}
                    <div className="mt-16">
                        <h3 className="text-2xl font-bold text-center text-slate-900 mb-8">What Our Global Users Say</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex items-center mb-4">
                                    <div className="flex">
                                        <span className="material-icons-outlined text-yellow-400">star</span>
                                        <span className="material-icons-outlined text-yellow-400">star</span>
                                        <span className="material-icons-outlined text-yellow-400">star</span>
                                        <span className="material-icons-outlined text-yellow-400">star</span>
                                        <span className="material-icons-outlined text-yellow-400">star</span>
                                    </div>
                                </div>
                                <p className="text-slate-700 mb-4">"This tool has transformed how we handle client proposals. We've reduced our document creation time by 75% and improved accuracy significantly."</p>
                                <div className="flex items-center gap-3">
                                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Michael Johnson" className="w-10 h-10 rounded-full object-cover"/>
                                    <div>
                                        <p className="font-bold text-slate-900">Michael Johnson</p>
                                        <p className="text-slate-600">Sales Director, Tech Solutions Inc. (USA)</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex items-center mb-4">
                                    <div className="flex">
                                        <span className="material-icons-outlined text-yellow-400">star</span>
                                        <span className="material-icons-outlined text-yellow-400">star</span>
                                        <span className="material-icons-outlined text-yellow-400">star</span>
                                        <span className="material-icons-outlined text-yellow-400">star</span>
                                        <span className="material-icons-outlined text-yellow-400">star</span>
                                    </div>
                                </div>
                                <p className="text-slate-700 mb-4">"As a teacher in Kathmandu, this tool has been a blessing. Creating personalized feedback for 200+ students used to take weeks, now it's done in minutes."</p>
                                <div className="flex items-center gap-3">
                                    <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Sunita Thapa" className="w-10 h-10 rounded-full object-cover"/>
                                    <div>
                                        <p className="font-bold text-slate-900">Sunita Thapa</p>
                                        <p className="text-slate-600">Senior Teacher, National School (Nepal)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Final CTA */}
                <Section isGray>
                    <div className="text-center max-w-4xl mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-12 text-white">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Ready to Transform Your Document Workflow?</h2>
                        <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
                            Join thousands of professionals who save hours every week with Marge It Pro. 
                            Start your free trial today - no credit card required.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <CtaButton href="#login" primary className="text-lg px-8 py-4 bg-white text-indigo-600 hover:bg-slate-100">
                                Start Free Trial <span className="material-icons-outlined text-xl ml-2">arrow_forward</span>
                            </CtaButton>
                            <CtaButton href="#features" className="text-lg px-8 py-4 bg-transparent border border-white text-white hover:bg-white/10">
                                Watch Demo
                            </CtaButton>
                        </div>
                    </div>
                </Section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white p-6 md:py-8 shadow-2xl">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">

                    {/* 1. Left Align: Copyright */}
                    {/* On mobile (flex-col), this is the last item (order-4) */}
                    <div className="text-sm text-gray-400 order-4 md:order-1 text-center md:text-left md:w-1/4">
                        &copy; 2025 Marge It Pro. All rights reserved.
                    </div>

                    {/* 2 & 3. Center Content Container: Designed/Developed + Profile Image */}
                    {/* On mobile, this block is centered */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-12 order-2 md:w-2/4">

                        {/* 2. Center Left Align: Designed & Developed */}
                        <div className="text-center">
                            <b className="text-sm tracking-wider text-gray-300">Designed & Developed By</b><br />
                            <div className="mt-2">
                                <h3 className="name text-lg font-bold text-white">Man Singh Rana</h3>
                                <p className="text-gray-400 text-sm mt-1">Full Stack Developer & UI/UX Designer</p>
                                <div className="flex justify-center gap-2 mt-2">
                                    <a href="https://linkedin.com/in/man-singh-rana" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                        <span className="material-icons-outlined text-lg">person</span>
                                    </a>
                                    <a href="https://github.com/man-singh-rana" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                        <span className="material-icons-outlined text-lg">code</span>
                                    </a>
                                    <a href="mailto:manishconfid@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                                        <span className="material-icons-outlined text-lg">email</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* 3. Center Right Align: Image */}
                        <div className="flex-shrink-0">
                            <img
                                src="https://lh3.googleusercontent.com/pw/AP1GczNBafUwK_kk9w-_61hgYeiqwWXCg-0BLU3w88BvcUAed3ts02C4ylZ6f5EITTn5Q71hvH7Rv0H77Guay5eSDaOroRpyhlYXQqcgf6Sst1a1KYyoLg=w2400"
                                alt="Profile Photo"
                                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-xl transition duration-300 transform hover:scale-105"
                                onError={(e) => e.currentTarget.src = 'https://placehold.co/64x64/2563eb/ffffff?text=MR'}
                            />
                        </div>
                    </div>


                    {/* 4. Right Align: Links */}
                    {/* On mobile, these links appear after the center content, before copyright */}
                    <div className="flex space-x-4 order-3 md:order-4 text-sm text-center md:text-right md:w-1/4">
                        <a 
                            onClick={(e) => {
                                e.preventDefault();
                                if (navigateTo) {
                                    navigateTo('privacy-policy');
                                } else {
                                    window.location.hash = 'privacy-policy';
                                }
                            }}
                            className="text-gray-400 hover:text-indigo-500 transition-colors duration-200 p-1 rounded-md cursor-pointer"
                        >
                            Privacy Policy
                        </a>
                        <a 
                            onClick={(e) => {
                                e.preventDefault();
                                if (navigateTo) {
                                    navigateTo('terms-of-service');
                                } else {
                                    window.location.hash = 'terms-of-service';
                                }
                            }}
                            className="text-gray-400 hover:text-indigo-500 transition-colors duration-200 p-1 rounded-md cursor-pointer"
                        >
                            Terms of Service
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
