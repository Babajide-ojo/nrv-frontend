import React from 'react';
import logo from "./../../../public/images/nrv-logo.png";
import Image from 'next/image';

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
    <div className="animate-zoom text-nrvPrimaryGreen text-lg">
      Loading...
    </div>
  </div>
  
  );
};

export default LoadingPage;
