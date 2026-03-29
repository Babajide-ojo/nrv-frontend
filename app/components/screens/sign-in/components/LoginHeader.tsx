import React from "react";
import Link from "next/link";
import Image from "next/image";

const LoginHeader: React.FC = () => {
  return (
    <div className="mb-8">
      {/* Mobile Logo */}
      <div className="mb-6">
        <Link href="/" className="inline-block">
          <Image
            src="/images/nrv-logo-latest.jpg"
            alt="NaijaRentVerify"
            width={200}
            height={50}
            className="h-10 sm:h-12 w-auto"
            priority
          />
        </Link>
      </div>
      
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