import React from 'react';

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[40vh] sm:min-h-80 w-full px-4 bg-white">
      <div className="animate-zoom text-nrvPrimaryGreen text-base sm:text-lg text-center">
        Loading...
      </div>
    </div>
  );
};

export default LoadingPage;
