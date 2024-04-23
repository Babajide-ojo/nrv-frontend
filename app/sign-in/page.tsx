"use client"

import React, { useState, useEffect } from 'react';
import LoginScreen from "@/components/screens/sign-in/LoginScreen";
import LoadingPage from '@/components/loaders/LoadingPage';

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 

    return () => clearTimeout(timer); 
  }, []);

  return (
    <div>
      {isLoading ? <LoadingPage /> : <LoginScreen />} 
    </div>
  );
};

export default SignIn;
