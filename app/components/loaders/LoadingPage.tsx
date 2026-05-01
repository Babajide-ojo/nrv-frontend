import React from 'react';

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[40vh] sm:min-h-80 w-full px-4 bg-white">
      <div
        role="status"
        aria-label="Loading"
        className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-green-600"
      />
    </div>
  );
};

export default LoadingPage;
