import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const AccessDenied = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 animate-fade-in-up">
      <div className="glass-card p-10 rounded-3xl border border-red-500/30 shadow-2xl shadow-red-500/10 text-center max-w-md w-full relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>

        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-red-500/30">
          <ShieldAlert size={48} className="text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-8">
          You typically do not have permission to view this page. If you believe this is an error, please contact your administrator.
        </p>

        <a href="/" className="btn-primary-gradient w-full py-3 rounded-xl flex items-center justify-center gap-2 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Return Home</span>
        </a>
      </div>
    </div>
  );
};

export default AccessDenied;
