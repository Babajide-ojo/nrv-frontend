"use client"

import React, { useState, useEffect } from 'react';
import LoginScreen from "@/app/components/screens/sign-in/LoginScreen";
import LoadingPage from '@/app/components/loaders/LoadingPage';
import SignUpScreen from '@/app/components/screens/sign-up/SignUpScreen';

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 

    return () => clearTimeout(timer); 
  }, [null]);

  return (
    <div>
      {isLoading ? <LoadingPage /> : <SignUpScreen />} 
    </div>
  );
};

export default SignIn;
