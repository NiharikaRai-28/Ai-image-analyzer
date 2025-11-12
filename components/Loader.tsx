
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="w-4 h-4 rounded-full animate-pulse bg-white"></div>
      <div className="w-4 h-4 rounded-full animate-pulse bg-white delay-200"></div>
      <div className="w-4 h-4 rounded-full animate-pulse bg-white delay-400"></div>
      <span className="ml-2">Analyzing...</span>
    </div>
  );
};

export default Loader;
