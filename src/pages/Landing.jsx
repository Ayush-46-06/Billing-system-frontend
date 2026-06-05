import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, Users, ShieldCheck, PieChart, ArrowRight, 
  CheckCircle2, Menu, X, Star, Zap, Globe, Lock,
  UserPlus, Settings, Send
} from "lucide-react";
import logo from "../assets/color.png";
import workspaceImg from "../assets/Workspace.svg";

const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900 text-slate-900 overflow-x-hidden">
      <style>{`
        @keyframes float1 { 0%, 100% { transform: translateY(0) rotate(-12deg); } 50% { transform: translateY(-20px) rotate(-10deg); } }
        @keyframes float2 { 0%, 100% { transform: translateY(0) rotate(8deg); } 50% { transform: translateY(20px) rotate(10deg); } }
        @keyframes float3 { 0%, 100% { transform: translateY(0) rotate(5deg); } 50% { transform: translateY(-15px) rotate(3deg); } }
      `}</style>
      
      {/* --- STICKY NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <img src={logo} alt="Athenura" className="h-14" />
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">How it works</button>
            <button onClick={() => scrollToSection('testimonials')} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Testimonials</button>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/login" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5">
              Log In
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-lg py-4 px-6 flex flex-col gap-4">
            <button onClick={() => scrollToSection('features')} className="text-left font-medium text-slate-700 py-2">Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-left font-medium text-slate-700 py-2">How it works</button>
            <button onClick={() => scrollToSection('testimonials')} className="text-left font-medium text-slate-700 py-2">Testimonials</button>
            <div className="flex flex-col gap-3 mt-6">
              <Link to="/login" className="px-5 py-3 text-center bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 transition-colors">
                Log In
              </Link>
            </div>
          </div>
        )}
      </nav>


      {/* --- HERO SECTION --- */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 inset-x-0 h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-200/50 blur-3xl opacity-60"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 rounded-full bg-indigo-200/50 blur-3xl opacity-50"></div>
        </div>

        {/* Floating Background Images */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 hidden md:block">
          {/* Left image */}
          <div className="absolute top-[15%] left-[2%] w-72 h-auto" style={{ animation: 'float1 6s ease-in-out infinite' }}>
             <img src="/hero_invoice_illustration.png" alt="" className="w-full h-full object-contain mix-blend-multiply opacity-60" style={{ filter: 'contrast(1.1) brightness(1.05)' }} />
          </div>
          {/* Right top image */}
          <div className="absolute top-[5%] right-[2%] w-80 h-auto" style={{ animation: 'float2 8s ease-in-out infinite' }}>
             <img src="/hero_team_illustration.png" alt="" className="w-full h-full object-contain mix-blend-multiply opacity-60" style={{ filter: 'contrast(1.1) brightness(1.05)' }} />
          </div>
          {/* Right bottom image */}
          <div className="absolute bottom-[5%] right-[15%] w-64 h-auto" style={{ animation: 'float3 7s ease-in-out infinite' }}>
             <img src="/hero_growth_illustration.png" alt="" className="w-full h-full object-contain mix-blend-multiply opacity-60" style={{ filter: 'contrast(1.1) brightness(1.05)' }} />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight max-w-5xl mx-auto leading-[1.1] mb-8">
            Billing made <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">beautifully simple.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Automate invoices, manage clients effortlessly, and control access across your organization with a modern, secure, and fast platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/register" className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:-translate-y-1">
              Get Started for Free
              <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-white text-slate-700 font-semibold text-lg border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
              Sign in to Dashboard
            </Link>
          </div>




        </div>
      </header>





      {/* --- DETAILED FEATURES --- */}
      <section id="features" className="py-24 lg:py-32 relative">
        <div className="container mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-32">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Everything you need to scale</h2>
            <p className="text-lg text-slate-600">Stop wrestling with spreadsheets. Athenura gives you a complete toolkit to manage your finances professionally.</p>
          </div>

          {/* Feature 1: Left Text, Right Image */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-24 lg:mb-40">
            <div className="w-full lg:w-1/2 space-y-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <FileText size={32} />
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">Create professional invoices in seconds.</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Generate beautifully formatted PDF invoices that impress your clients. Automatically calculate totals, taxes, and discounts without manual math errors.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-green-500" size={20}/> Downloadable PDFs</li>
                <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-green-500" size={20}/> Automatic calculations</li>
                <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-green-500" size={20}/> Status tracking (Paid, Pending, Overdue)</li>
              </ul>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
                  <img src={workspaceImg} alt="Invoice Generator Mockup" className="w-full h-auto object-cover" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Right Text, Left Image */}
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-24 mb-24 lg:mb-40">
            <div className="w-full lg:w-1/2">
              <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center">
                  <img src="/access_control.png" alt="Access Control Mockup" className="w-full h-auto object-cover" />
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 space-y-8">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">Secure role-based access control.</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                As an Admin, invite Managers to your workspace. Control exactly what they can see and do. Protect your sensitive financial data while delegating workload.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-green-500" size={20}/> Multi-tier user roles (Admin & Manager)</li>
                <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-green-500" size={20}/> Secure JWT Authentication</li>
                <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-green-500" size={20}/> Granular permission limits</li>
              </ul>
            </div>
          </div>

          {/* Feature 3: Left Text, Right Image */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="w-full lg:w-1/2 space-y-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <PieChart size={32} />
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">Pre-defined Services & Taxes.</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Save time by creating a catalog of standard services and tax rates. Apply them instantly to any invoice without re-typing descriptions or looking up percentages.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-green-500" size={20}/> Centralized Tax management</li>
                <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-green-500" size={20}/> Reusable Service catalog</li>
                <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-green-500" size={20}/> Instantly apply to line items</li>
              </ul>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
                <div className="rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
                  <img src="/services_taxes.png" alt="Services and Taxes Mockup" className="w-full h-auto object-cover" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>





      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-24 bg-white border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">How it works</h2>
            <p className="text-lg text-slate-500">Get your billing automated and start getting paid faster in three simple steps.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-100 via-blue-500 to-blue-100 z-0"></div>
            
            {/* Step 1 */}
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 mx-auto bg-white border-4 border-slate-50 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-blue-900/5 transition-transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <UserPlus size={28} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Create Account</h3>
              <p className="text-slate-500">Sign up in seconds and set up your organization profile securely.</p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 mx-auto bg-white border-4 border-slate-50 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-blue-900/5 transition-transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <Settings size={28} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. Configure Billing</h3>
              <p className="text-slate-500">Add your services, configure tax rates, and set up role-based access.</p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 mx-auto bg-white border-4 border-slate-50 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-blue-900/5 transition-transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <Send size={28} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">3. Start Invoicing</h3>
              <p className="text-slate-500">Generate professional invoices, send them to clients, and manage payments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section id="testimonials" className="py-24 lg:py-32 bg-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Loved by managers everywhere</h2>
            <p className="text-lg text-slate-600">Don't just take our word for it. Here's what our users have to say.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex gap-1 text-yellow-400 mb-6">
                <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
              </div>
              <p className="text-slate-700 leading-relaxed mb-8">
                "Before Athenura, our billing was a mess of spreadsheets. Now, my managers can generate professional invoices in seconds. It's completely transformed our workflow."
              </p>
              <div className="flex items-center gap-4">
                <img src="https://ui-avatars.com/api/?name=Rohan+Sharma&background=0D8ABC&color=fff&rounded=true" alt="Rohan Sharma" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-slate-900">Rohan Sharma</h4>
                  <p className="text-sm text-slate-500">CEO, TechFlow</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex gap-1 text-yellow-400 mb-6">
                <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
              </div>
              <p className="text-slate-700 leading-relaxed mb-8">
                "The role-based access is exactly what we needed. I can safely give my sales team access to invoice their clients without exposing our entire financial database."
              </p>
              <div className="flex items-center gap-4">
                <img src="https://ui-avatars.com/api/?name=Priya+Patel&background=F59E0B&color=fff&rounded=true" alt="Priya Patel" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-slate-900">Priya Patel</h4>
                  <p className="text-sm text-slate-500">Operations Director</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex gap-1 text-yellow-400 mb-6">
                <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
              </div>
              <p className="text-slate-700 leading-relaxed mb-8">
                "Setting up predefined taxes and services saves me hours every week. The PDF generation is flawless and looks extremely professional to our enterprise clients."
              </p>
              <div className="flex items-center gap-4">
                <img src="https://ui-avatars.com/api/?name=Vikram+Singh&background=10B981&color=fff&rounded=true" alt="Vikram Singh" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-slate-900">Vikram Singh</h4>
                  <p className="text-sm text-slate-500">Freelance Consultant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* --- BOTTOM CTA --- */}
      <section className="py-24 relative overflow-hidden bg-slate-900">
        <div className="absolute top-0 inset-x-0 h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-600/20 blur-[100px]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to streamline your billing?</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Join thousands of businesses that use Athenura to get paid faster and manage their clients securely.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-slate-900 font-bold text-lg hover:bg-slate-100 transition-all shadow-xl hover:scale-105 active:scale-95">
            Create Your Free Account
            <ArrowRight size={20} />
          </Link>

        </div>
      </section>


      {/* --- FOOTER --- */}
      <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
            
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <img src={logo} alt="Athenura" className="h-12 grayscale opacity-80" />
              </div>
              <p className="text-slate-500 mb-6 max-w-xs">
                The modern billing management system designed for speed, security, and simplicity.
              </p>
              <div className="flex gap-4 text-slate-400">
                <a href="https://www.linkedin.com/company/athenura/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="https://www.instagram.com/athenura.in/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center hover:bg-pink-100 hover:text-pink-600 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
              <ul className="space-y-4 text-slate-500 flex flex-col items-start">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-blue-600 transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('testimonials')} className="hover:text-blue-600 transition-colors">Testimonials</button></li>
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-blue-600 transition-colors">Back to Top</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
              <ul className="space-y-4 text-slate-500">
                <li><Link to="/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-blue-600 transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">© 2026 Athenura Inc. All rights reserved.</p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Globe size={16} />
              <span>English (US)</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
