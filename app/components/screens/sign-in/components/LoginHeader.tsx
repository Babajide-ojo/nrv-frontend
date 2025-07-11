import React from "react";
import Image from "next/image";

const LoginHeader: React.FC = () => {
  return (
    <div className="mb-8">
      {/* Mobile Logo */}
      <div className="lg:hidden mb-6">
        <h1 className="text-2xl font-bold text-green-600">
          NaijaRentVerify
        </h1>
      </div>
      
      {/* Desktop Logo (optional) */}
      {/* <div className="hidden lg:block mb-6">
        <Image
          src="/images/light-green-logo.svg"
          alt="NaijaRentVerify Logo"
          width={200}
          height={50}
          className="h-12 w-auto"
        />
      </div> */}
      
      {/* Welcome Text */}
      <div className="text-center lg:text-left">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Welcome back!
        </h1>
        <p className="text-gray-500 text-[16px] font-light leading-8">
          Nice having you here again, Kindly enter the email address and
          password you used to create your account with us. 🔐
        </p>
      </div>
    </div>
  );
};

export default LoginHeader; 