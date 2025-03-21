"use client";

import Button from "@/app/components/shared/buttons/Button";
import InputField from "@/app/components/shared/input-fields/InputFields";
import Link from "next/link";
import { useState } from "react";
import { FaApple } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { ToastContainer } from "react-toastify";
import Carousel from "../sign-in/Carousel";
import SignUpMultiForm from "./SignUpMultiForm";

const SignUpScreen = () => {
  return (
    <div className="">
      <SignUpMultiForm />
    </div>
  );
};

export default SignUpScreen;
