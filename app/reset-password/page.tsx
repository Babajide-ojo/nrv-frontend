"use client"

import React, { useState, useEffect } from 'react';
import LoginScreen from "@/app/components/screens/sign-in/LoginScreen";
import LoadingPage from '@/app/components/loaders/LoadingPage';
import ResetPasswordScreen from '../components/screens/sign-in/ResetPasswordScreen';

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
      {isLoading ? <LoadingPage /> : <ResetPasswordScreen />} 
    </div>
  );
};

export default SignIn;
