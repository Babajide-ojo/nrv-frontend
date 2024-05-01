"use client"

import React, { useState, useEffect } from 'react';
import LoginScreen from "@/app/components/screens/sign-in/LoginScreen";
import LoadingPage from '@/app/components/loaders/LoadingPage';

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); 

    return () => clearTimeout(timer); 
  }, []);

  return (
    <div>
      {isLoading ? <LoadingPage /> : <LoginScreen />} 
    </div>
  );
};

export default SignIn;
