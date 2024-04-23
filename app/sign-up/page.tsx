"use client"

import React, { useState, useEffect } from 'react';
import LoginScreen from "@/components/screens/sign-in/LoginScreen";
import LoadingPage from '@/components/loaders/LoadingPage';
import SignUpScreen from '@/components/screens/sign-up/SignUpScreen';

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
      {isLoading ? <LoadingPage /> : <SignUpScreen />} 
    </div>
  );
};

export default SignIn;
