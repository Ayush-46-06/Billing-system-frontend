import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import logo from "../assets/color.png";

const TermsOfService = () => {
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
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-lg text-slate-500">Effective Date: June 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="prose prose-lg prose-slate max-w-none">
          <p className="lead text-xl text-slate-600 mb-10 leading-relaxed">
            These terms and conditions outline the rules and regulations for the use of Athenura's Website and Billing System. By accessing this website we assume you accept these terms and conditions in full. Do not continue to use Athenura if you do not accept all of the terms stated on this page.
          </p>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. License and Access</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Unless otherwise stated, Athenura and/or its licensors own the intellectual property rights for all material on Athenura. All intellectual property rights are reserved. You may access this from Athenura for your own personal use subjected to restrictions set in these terms and conditions.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4 font-semibold">You must not:</p>
            <ul className="list-disc pl-6 space-y-3 text-slate-600 marker:text-indigo-500 mb-8">
              <li>Republish material from Athenura.</li>
              <li>Sell, rent or sub-license material from Athenura.</li>
              <li>Reproduce, duplicate or copy material from Athenura.</li>
              <li>Redistribute content from Athenura without express written permission.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. User Accounts</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>
            <p className="text-slate-600 leading-relaxed">
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
            </p>
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

export default TermsOfService;
