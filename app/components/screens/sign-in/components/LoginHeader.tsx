import React from "react";

const LoginHeader: React.FC = () => {
  return (
    <div className="mb-6 sm:mb-8 w-full min-w-0">
      {/* Welcome Text */}
      <div className="text-center lg:text-left px-0">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
          Welcome back!
        </h1>
        <p className="text-gray-500 text-[15px] sm:text-[16px] font-light leading-7 sm:leading-8">
          Nice having you here again, Kindly enter the email address and
          password you used to create your account with us. 🔐
        </p>
      </div>
    </div>
  );
};

export default LoginHeader; 