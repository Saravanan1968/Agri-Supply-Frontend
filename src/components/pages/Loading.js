import React from 'react';

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 animate-fade-in-up">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary/30 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-primary rounded-full animate-spin"></div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-secondary-light">
          Loading
        </h2>
        <p className="text-gray-400 text-sm">Please wait while we fetch the data...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
