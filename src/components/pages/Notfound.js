import React from "react";
import { useNavigate } from "react-router-dom";
import { FileQuestion, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 animate-fade-in-up">
      <div className="text-center max-w-md w-full">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
          <FileQuestion size={120} className="text-white/20 relative z-10" />
        </div>

        <h1 className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>

        <button
          className="btn-primary-gradient px-8 py-3 rounded-full flex items-center justify-center gap-2 mx-auto group shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
          onClick={handleHomeClick}
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Go Back Home</span>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
