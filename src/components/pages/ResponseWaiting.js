import React from "react";

const LoadingOverlay = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col items-center gap-6 shadow-2xl shadow-primary/20">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary/30 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-1">Processing Action</h3>
          <p className="text-gray-400 text-sm">Please verify the transaction in your wallet...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
