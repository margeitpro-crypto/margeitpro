import React, { useRef, useEffect, useState } from 'react';
import { getBillingPlansData } from '../services/gasClient';
import { BillingPlan } from '../types';

// Reusable components for the landing page

const NavLink: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const targetId = href.replace('#', '');
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
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


const HomePage: React.FC = () => {
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
                            <button onClick={() => scrollToSection(planRef)} className="text-slate-600 hover:text-slate-900 transition-colors font-medium cursor-pointer">Plan</button>
                            <button onClick={() => scrollToSection(howItWorksRef)} className="text-slate-600 hover:text-slate-900 transition-colors font-medium cursor-pointer">How It Works</button>
                            <button onClick={() => scrollToSection(useCasesRef)} className="text-slate-600 hover:text-slate-900 transition-colors font-medium cursor-pointer">Use Cases</button>
                        </nav>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <a href="#login" className="hidden sm:inline-block text-slate-600 hover:text-slate-900 font-semibold transition-colors">Login</a>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="pt-40 pb-16 text-center bg-slate-50">
                    <div className="max-w-4xl mx-auto px-6 lg:px-8">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
                            Automate Your Document Creation
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                            Marge It Pro effortlessly merges data from Google Sheets into beautiful Google Docs and Slides, saving you hours of manual work.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <CtaButton href="#login" primary>
                                Get Started for Free <span className="material-icons-outlined text-xl ml-1">arrow_forward</span>
                            </CtaButton>
                             <CtaButton href="#features">
                                Learn More
                            </CtaButton>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <Section id="features" ref={featuresRef}>
                    <SectionTitle
                        title="Why Choose Marge It Pro?"
                        subtitle="Discover the powerful features that make document automation a breeze."
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                         <FeatureCard icon="grid_on" title="Sheet to Slides" description="Effortlessly merge data from Google Sheets into stunning presentations in Google Slides." color="text-blue-600" />
                         <FeatureCard icon="article" title="Sheet to Docs" description="Generate personalized documents in Google Docs from your spreadsheet data in seconds." color="text-green-600" />
                         <FeatureCard icon="layers" title="Template Management" description="Manage your Google Docs and Slides templates directly within the application for easy access." color="text-purple-600" />
                         <FeatureCard icon="auto_awesome" title="AI-Powered Assistance" description="Utilize GenAI to suggest templates, match data fields, and auto-populate documents." color="text-orange-600" />
                    </div>
                </Section>

                {/* Plan Section */}
                <Section id="plan" isGray ref={planRef}>
                    <SectionTitle
                        title="Choose Your Plan"
                        subtitle="Select the perfect plan for your document automation needs."
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
                                <div key={plan.id} className={`p-8 rounded-2xl border shadow-sm text-center ${index === 1 ? 'bg-indigo-600 border-indigo-600 shadow-lg text-white relative' : 'bg-white border-slate-200'}`}>
                                    {index === 1 && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</div>
                                    )}
                                    <h3 className={`text-2xl font-bold mb-4 ${index === 1 ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                                    <div className={`text-4xl font-bold mb-2 ${index === 1 ? 'text-white' : 'text-slate-900'}`}>
                                        {typeof plan.price === 'number' ? `${plan.currency === 'NPR' ? 'रू' : plan.currency === 'INR' ? '₹' : '$'}${plan.price}` : plan.price}
                                        {plan.pricePeriod && <span className={`text-lg font-normal ${index === 1 ? 'opacity-80' : 'text-slate-600'}`}>{plan.pricePeriod}</span>}
                                    </div>
                                    <ul className={`mb-6 space-y-2 ${index === 1 ? 'opacity-90' : 'text-slate-600'}`}>
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx}>{feature}</li>
                                        ))}
                                    </ul>
                                    <CtaButton
                                        href="#login"
                                        primary={index !== 1}
                                        className={`w-full ${index === 1 ? 'bg-white text-indigo-600 hover:bg-slate-50' : ''}`}
                                    >
                                        {plan.buttonText}
                                    </CtaButton>
                                </div>
                            ))
                        )}
                    </div>
                </Section>

                {/* How it Works Section */}
                 <Section id="how-it-works" isGray ref={howItWorksRef}>
                    <SectionTitle
                        title="Simple Steps to Success"
                        subtitle="Just three easy steps to automate your workflow."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         <StepCard number="1" title="Connect Your Data" description="Provide the ID of your Google Sheet and specify the data range you want to use."/>
                         <StepCard number="2" title="Choose Your Template" description="Select a pre-made Google Docs or Slides template, or use your own by providing its ID."/>
                         <StepCard number="3" title="Merge with a Click" description="Click 'Marge It' and let our system generate your documents or presentations automatically."/>
                    </div>
                </Section>

                {/* Use Cases/Roles Section */}
                <Section id="use-cases" ref={useCasesRef}>
                    <SectionTitle
                        title="Perfect for Any Role"
                        subtitle="From sales to education, Marge It Pro adapts to your needs."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         <RoleCard icon="work" title="Sales Teams" description="Generate personalized sales proposals, contracts, and quotes for each client instantly." color="text-blue-600" />
                         <RoleCard icon="groups" title="HR Departments" description="Automate the creation of offer letters, employee contracts, and onboarding documents." color="text-green-600" />
                         <RoleCard icon="school" title="Educators" description="Create custom certificates, report cards, and personalized feedback for students in bulk." color="text-purple-600" />
                    </div>
                </Section>

                {/* Testimonials Section */}
                <Section isGray>
                     <SectionTitle
                        title="Loved by Professionals"
                        subtitle="Hear what our users have to say about Marge It Pro."
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <TestimonialCard
                            quote="Marge It Pro has saved our team countless hours. What used to take a full day of copying and pasting now takes minutes. It's a game-changer for our workflow!"
                            name="Man Singh Rana"
                            role="Designer & developer"
                            avatar="https://lh3.googleusercontent.com/pw/AP1GczNBafUwK_kk9w-_61hgYeiqwWXCg-0BLU3w88BvcUAed3ts02C4ylZ6f5EITTn5Q71hvH7Rv0H77Guay5eSDaOroRpyhlYXQqcgf6Sst1a1KYyoLg=w2400"
                        />
                         <TestimonialCard
                            quote="Onboarding new employees is so much smoother now. We can generate all necessary documents with a single click. Highly recommended for any HR professional."
                            name="Man Singh Rana"
                            role="HR Executive"
                            avatar="https://lh3.googleusercontent.com/pw/AP1GczNBafUwK_kk9w-_61hgYeiqwWXCg-0BLU3w88BvcUAed3ts02C4ylZ6f5EITTn5Q71hvH7Rv0H77Guay5eSDaOroRpyhlYXQqcgf6Sst1a1KYyoLg=w2400"
                        />
                    </div>
                </Section>

                {/* Reviews Section */}
                <Section>
                    <SectionTitle
                        title="Trusted by Leading Schools & Companies"
                        subtitle="See how educational institutions and businesses are transforming their document workflows."
                    />

                    {/* School Reviews */}
                    <div className="mb-16">
                        <h3 className="text-2xl font-bold text-slate-900 text-center mb-8 flex items-center justify-center gap-2">
                            <span className="material-icons-outlined text-4xl text-blue-600">school</span> Popular Schools
                        </h3>
                        <div ref={schoolsRef} className="overflow-x-auto scrollbar-hide">
                            <div className="flex gap-6 pb-4" style={{width: 'max-content'}}>
                                <ReviewCard
                                    quote="Marge It Pro revolutionized our certificate generation process. We now create personalized certificates for hundreds of students in minutes instead of days."
                                    name="Dr. Priya Patel"
                                    role="Principal, Delhi Public School"
                                    avatar="https://randomuser.me/api/portraits/women/32.jpg"
                                    rating={5}
                                />
                                <ReviewCard
                                    quote="The automated report card system has saved our teachers countless hours. The integration with Google Workspace is seamless."
                                    name="Mr. Ramesh Kumar"
                                    role="Vice Principal, St. Mary's School"
                                    avatar="https://randomuser.me/api/portraits/men/45.jpg"
                                    rating={5}
                                />
                                <ReviewCard
                                    quote="From admission letters to progress reports, everything is now automated. Our administrative workload has reduced by 80%."
                                    name="Ms. Anita Singh"
                                    role="Administrative Head, Modern School"
                                    avatar="https://randomuser.me/api/portraits/women/28.jpg"
                                    rating={5}
                                />
                                <ReviewCard
                                    quote="The AI-powered template suggestions are incredible. It understands our needs and provides perfect document layouts."
                                    name="Dr. Vikram Sharma"
                                    role="Director, Cambridge School"
                                    avatar="https://randomuser.me/api/portraits/men/50.jpg"
                                    rating={5}
                                />
                                <ReviewCard
                                    quote="Student feedback forms and parent communication letters are now generated instantly. Excellent tool for modern education."
                                    name="Mrs. Meera Joshi"
                                    role="Coordinator, Little Angels School"
                                    avatar="https://randomuser.me/api/portraits/women/35.jpg"
                                    rating={5}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Company Reviews */}
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 text-center mb-8 flex items-center justify-center gap-2">
                            <span className="material-icons-outlined text-4xl text-green-600">business</span> Leading Companies
                        </h3>
                        <div ref={companiesRef} className="overflow-x-auto scrollbar-hide">
                            <div className="flex gap-6 pb-4" style={{width: 'max-content'}}>
                                <ReviewCard
                                    quote="Our sales team generates personalized proposals and contracts in seconds. Revenue increased by 40% due to faster response times."
                                    name="Amitabh Verma"
                                    role="Sales Director, TechCorp Solutions"
                                    avatar="https://randomuser.me/api/portraits/men/40.jpg"
                                    rating={5}
                                />
                                <ReviewCard
                                    quote="HR onboarding documents are now fully automated. From offer letters to policy documents, everything is streamlined."
                                    name="Sneha Gupta"
                                    role="HR Manager, GlobalTech Industries"
                                    avatar="https://randomuser.me/api/portraits/women/30.jpg"
                                    rating={5}
                                />
                                <ReviewCard
                                    quote="Financial reports and client statements are generated automatically. Our accounting department is 70% more efficient."
                                    name="Rajiv Mehta"
                                    role="CFO, FinanceHub Ltd"
                                    avatar="https://randomuser.me/api/portraits/men/55.jpg"
                                    rating={5}
                                />
                                <ReviewCard
                                    quote="Marketing materials and campaign reports are now created instantly. The AI suggestions for layouts are spot-on."
                                    name="Kavita Rao"
                                    role="Marketing Head, Creative Solutions"
                                    avatar="https://randomuser.me/api/portraits/women/38.jpg"
                                    rating={5}
                                />
                                <ReviewCard
                                    quote="Legal document automation has transformed our workflow. Contracts and agreements are generated with perfect accuracy."
                                    name="Arun Prakash"
                                    role="Legal Counsel, LegalTech Partners"
                                    avatar="https://randomuser.me/api/portraits/men/48.jpg"
                                    rating={5}
                                />
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Nepali Schools Logos Section */}
                <Section isGray>
                    <SectionTitle
                        title="Trusted by Schools Across Nepal"
                        subtitle="Join hundreds of educational institutions in Nepal who trust Marge It Pro for their document automation needs."
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center">
                        <div className="flex items-center justify-center">
                            <img src="https://lh3.googleusercontent.com/pw/AP1GczNIZwjO76ZHEgCQkKlpOia006gD7iIvcqv5Qkne3rIuYpx8-F7OgbKrRGDl7RJ2CKjTYW_j1-JXdreJnx1MCm6XdOTh9V3UVM7KtZYqcG_XuZoWKA=w2400" alt="School Logo 1" className="h-20 object-contain transition-all duration-300" onError={(e) => e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjY2NjY2NjIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiLz48dGV4dCB4PSI2MCIgeT0iNDAiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMwMDAwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxvZ288L3RleHQ+PC9zdmc+'} />
                        </div>
                        <div className="flex items-center justify-center">
                            <img src="https://lh3.googleusercontent.com/pw/AP1GczONZdGj8go2210JXuwrcABgUSsdPlATw7_16MXQqHtyWAA4kU4tqJGqYC9EIlyb8MgTdF2QBDIuVECyOqebnQZQLz7wi34feqPGZEdp675JD9VO-A=w2400" alt="School Logo 2" className="h-20 object-contain transition-all duration-300" onError={(e) => e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjY2NjY2NjIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiLz48dGV4dCB4PSI2MCIgeT0iNDAiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMwMDAwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxvZ288L3RleHQ+PC9zdmc+'} />
                        </div>
                        <div className="flex items-center justify-center">
                            <img src="https://lh3.googleusercontent.com/pw/AP1GczPIck4sHLBuUhCBxrCW91CWzOZXHi1yBDQ0R7itsWEveKdh_VvbfLDX_uvHeZ26OtgeFlHNL0xLehMJrG0aiWbuEjN5m1IxRJVSPOR1PfHGibBzIg=w2400" alt="School Logo 3" className="h-20 object-contain transition-all duration-300" onError={(e) => e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjY2NjY2NjIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiLz48dGV4dCB4PSI2MCIgeT0iNDAiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMwMDAwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxvZ288L3RleHQ+PC9zdmc+'} />
                        </div>
                        <div className="flex items-center justify-center">
                            <img src="https://lh3.googleusercontent.com/pw/AP1GczNAXBMimIyb_C07Qt7tbopGI0eGlnQLWKd7jSoMPf8EZLwCYomm72Fmww84-F69OflDaEB9FG1pvu3PNfAyy-A4zm91hwblvgZEAgvfB_tlr_Tl0Q=w2400" alt="School Logo 4" className="h-20 object-contain transition-all duration-300" onError={(e) => e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjY2NjY2NjIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiLz48dGV4dCB4PSI2MCIgeT0iNDAiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMwMDAwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxvZ288L3RleHQ+PC9zdmc+'} />
                        </div>
                        <div className="flex items-center justify-center">
                            <img src="https://lh3.googleusercontent.com/pw/AP1GczN9FHbOSDyepCgGsgP51QsPfkdss0fKC27SlnAdOIarWY-8pPuJZfRa-m0Zqj4TWjmthS0eezdZsxhZw46gxIvSLgmBDxo1GeY2PSGErqLXfvHV9g=w2400" alt="School Logo 5" className="h-20 object-contain transition-all duration-300" onError={(e) => e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjY2NjY2NjIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiLz48dGV4dCB4PSI2MCIgeT0iNDAiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMwMDAwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxvZ288L3RleHQ+PC9zdmc+'} />
                        </div>
                        <div className="flex items-center justify-center">
                            <img src="https://lh3.googleusercontent.com/pw/AP1GczNEe50RCOW5r0iHwkc9Kz0j5iav_xOppeelg2oqr4_Q9qXQ0LchQhM6QQXEe9sz27GkVk33y4qYXzG4VcSFgyhoGoFFPaz32JRq53jaYYpz73tx8A=w2400" alt="School Logo 6" className="h-20 object-contain transition-all duration-300" onError={(e) => e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjY2NjY2NjIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiLz48dGV4dCB4PSI2MCIgeT0iNDAiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMwMDAwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxvZ288L3RleHQ+PC9zdmc+'} />
                        </div>
                        <div className="flex items-center justify-center">
                            <img src="https://lh3.googleusercontent.com/pw/AP1GczNz9wPJ7m--JgSsgenTVXUPQPhQ_L7nQ9v-RIQ6Fo27lqmKiRUOZhNg5KAGzK8LmrlFRnHSQM3flAQUhaZ1fKlJs7TUsKZ76mrDFoUMe7NBqOo2ew=w2400" alt="School Logo 7" className="h-20 object-contain transition-all duration-300" onError={(e) => e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjY2NjY2NjIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiLz48dGV4dCB4PSI2MCIgeT0iNDAiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMwMDAwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxvZ288L3RleHQ+PC9zdmc+'} />
                        </div>
                        <div className="flex items-center justify-center">
                            <img src="https://lh3.googleusercontent.com/pw/AP1GczPE5V2Dt7j1eeGUyXbCvKTJRQ1HbYn0w3vsSMI1Pj5Us06P6k3xBGT3r4A5mjjPUysY97n9dXBjlHmG2lHcG25uphqaNlk-4N9pWo_FhiS2ryHW9g=w2400" alt="School Logo 8" className="h-20 object-contain transition-all duration-300" onError={(e) => e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjY2NjY2NjIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiLz48dGV4dCB4PSI2MCIgeT0iNDAiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMwMDAwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxvZ288L3RleHQ+PC9zdmc+'} />
                        </div>
                        <div className="flex items-center justify-center">
                            <img src="https://lh3.googleusercontent.com/pw/AP1GczNFXkQXemp6GHG4F3BICU-XFKsuQJ27r5CAmbMFHVco-iWSnNsCzUO_1F1XEQ36rsLHQK7DfXnTT0HiY7wR76ad-YBzk-ZAu7ypjQmUVMpUJYy_Jw=w2400" alt="School Logo 9" className="h-20 object-contain transition-all duration-300" onError={(e) => e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjY2NjY2NjIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiLz48dGV4dCB4PSI2MCIgeT0iNDAiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMwMDAwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxvZ288L3RleHQ+PC9zdmc+'} />
                        </div>
                        <div className="flex items-center justify-center">
                            <img src="https://lh3.googleusercontent.com/pw/AP1GczNGP2ulLwSmF1S_Hl0JEJwp6N6bNa3pnSEQspIBHdk-_mQAO9k3kxGTUImdHaTs5UvA6d3vD9gFpT_LOCOmfqdxe4ddN6rd-nHyMBNb2Im1ufQlOA=w2400" alt="Nepal International School" className="h-20 object-contain transition-all duration-300" onError={(e) => e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjY2NjY2NjIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiLz48dGV4dCB4PSI2MCIgeT0iNDAiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMwMDAwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkVycm9yPC90ZXh0Pjwvc3ZnPg=='} />
                        </div>
                    </div>
                </Section>

                {/* Final CTA */}
                <Section>
                    <div className="text-center max-w-3xl mx-auto bg-white p-10 rounded-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Ready to Save Hours of Work?</h2>
                        <p className="mt-4 text-lg text-slate-600">Join hundreds of professionals who are automating their document workflows. Sign up now and start merging in minutes.</p>
                         <div className="mt-8">
                            <CtaButton href="#login" primary className="text-lg px-8 py-4">
                                Start Your Free Trial Today <span className="material-icons-outlined text-xl ml-1">arrow_forward</span>
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
                            <span className="name">Man Singh Rana</span>
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
                        <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors duration-200 p-1 rounded-md">Privacy Policy</a>
                        <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors duration-200 p-1 rounded-md">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
