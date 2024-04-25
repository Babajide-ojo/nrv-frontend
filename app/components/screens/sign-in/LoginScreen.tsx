"use client";

import Button from "@/app/components/shared/buttons/Button";
import InputField from "@/app/components/shared/input-fields/InputFields";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaApple } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { carouselData } from "@/helpers/data";
import Carousel from "./Carousel";

const LoginScreen = () => {
  return (
    <div className="flex justify-center  h-screen">
      <Carousel />
      <div className="w-full sm:w-1/2 p-16 justify-center">
        <div className="max-w-md">
          <div className="text-3xl text-nrvGreyBlack font-semibold">
            Welcome Back, Samuel 🤗,
          </div>
          <div className="pt-2 text-nrvLightGrey text-md">
            Please enter your login to access your account.
          </div>
          <div className="pt-1 text-nrvLightGrey text-md flex gap-2">
            Not a landlord?{" "}
            <Link className="underline text-nrvDarkBlue" href="/">
              sign in as tenant
            </Link>
          </div>
          <div className="pt-4">
            <Button
              className="w-full block"
              size="large"
              variant="whitebg"
              showIcon={false}
            >
              {" "}
              <div className="flex gap-1">
                <FaApple color="black" size={22} /> Sign in with Apple
              </div>
            </Button>
          </div>
          <div className="pt-4">
            <Button
              className="w-full block"
              size="large"
              variant="whitebg"
              showIcon={false}
            >
              <div className="flex gap-1">
                <FcGoogle size={22} /> Sign in with Google
              </div>
            </Button>
          </div>
          <div className="flex items-center w-full mt-6">
            <div className="w-5/12 border-b border-nrvLightGrey"></div>
            <div className="w-2/12 text-center text-nrvLightGrey">OR</div>
            <div className="w-5/12 border-b border-nrvLightGrey"></div>
          </div>
          <div className="w-full mt-6">
            <div className="mt-2">
              <InputField
                label="Email Address"
                placeholder="Enter your email address"
                inputType="email"
                // onChange={handleEmailChange}
                name="email"
              />
            </div>
            <div className="mt-4">
              <InputField
                label="Password"
                placeholder="Enter your password"
                inputType="password"
                // onChange={handlePasswordChange}
                name="password"
              />
            </div>
          </div>
          <div className="w-full flex justify-between mt-6">
            <div className="text-sm text-nrvLightGrey">Remember Me</div>
            <Link
              href="#"
              className="text-sm underline font-light text-[#153969]"
            >
              Forgot password
            </Link>
          </div>
          <div className="mt-20 pt-10">
            <Button
              size="large"
              className="block w-full"
              variant="bluebg"
              showIcon={false}
            >
              Continue
            </Button>
          </div>
          <div className="w-full justify-center flex gap-3 mt-4">
            <div className="text-sm text-nrvLightGrey">
              Do not have an account?
            </div>
            <Link
              href="/sign-up"
              className="text-sm underline font-light text-[#153969]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
