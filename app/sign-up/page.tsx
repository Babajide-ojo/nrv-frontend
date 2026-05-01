"use client";

import React, { Suspense } from "react";
import LoadingPage from "@/app/components/loaders/LoadingPage";
import SignUpScreen from "@/app/components/screens/sign-up/SignUpScreen";

const SignUpPage = () => {
  return (
    <div>
      <Suspense fallback={<LoadingPage />}>
        <SignUpScreen />
      </Suspense>
    </div>
  );
};

export default SignUpPage;
