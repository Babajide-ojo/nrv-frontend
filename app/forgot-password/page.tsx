"use client"

import React, { useState, useEffect } from 'react';
import LoadingPage from '@/app/components/loaders/LoadingPage';
import VerifyEmailScreen from '../components/screens/sign-in/VerifyEmailScreen';

const verifyEmail = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 

    return () => clearTimeout(timer); 
  }, []);

  return (
    <div>
      {isLoading ? <LoadingPage /> : <VerifyEmailScreen />} 
    </div>
  );
};

export default verifyEmail;
