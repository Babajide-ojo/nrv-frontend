"use client"

import React, { useState, useEffect } from 'react';
import LoginScreen from "@/app/components/screens/sign-in/LoginScreen";
import LoadingPage from '@/app/components/loaders/LoadingPage';

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div>
      <LoginScreen />
    </div>
  );
};

export default SignIn;
