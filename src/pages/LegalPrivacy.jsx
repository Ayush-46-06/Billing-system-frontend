import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import logo from "../assets/color.png";

const LegalPrivacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm py-4 border-b border-slate-100">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Athenura" className="h-14" />
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="pt-32 pb-12 bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-lg text-slate-500">Effective Date: June 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="prose prose-lg prose-slate max-w-none">
          <p className="lead text-xl text-slate-600 mb-10 leading-relaxed">
            Athenura respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Important information and who we are</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Athenura is the controller and responsible for your personal data (collectively referred to as "Athenura", "we", "us" or "our" in this privacy policy). We have appointed a data privacy manager who is responsible for overseeing questions in relation to this privacy policy.
            </p>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">2. The data we collect about you</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-slate-600 marker:text-blue-500">
              <li><strong className="text-slate-800">Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong className="text-slate-800">Contact Data:</strong> includes billing address, email address and telephone numbers.</li>
              <li><strong className="text-slate-800">Financial Data:</strong> includes bank account and payment card details (processed securely via our payment partners).</li>
              <li><strong className="text-slate-800">Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
            <h2 className="text-xl font-bold text-blue-900 mb-2">Have questions about your privacy?</h2>
            <p className="text-blue-800 mb-4">Our data protection team is here to help you understand your rights.</p>
            <a href="mailto:privacy@athenura.com" className="font-semibold text-blue-600 hover:text-blue-700 underline">Contact Privacy Team &rarr;</a>
          </div>
        </div>
      </div>
      
      {/* Minimal Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
        <p>© 2026 Athenura Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LegalPrivacy;
