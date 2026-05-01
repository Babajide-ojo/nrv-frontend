import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

interface SocialLoginButtonProps {
  provider: 'google' | 'facebook';
  onClick: () => void;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  onClick,
}) => {
  const getProviderConfig = () => {
    switch (provider) {
      case 'google':
        return {
          icon: <FcGoogle size={20} />,
          text: 'Continue with Google',
          bgColor: 'bg-white',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-300',
          hoverBg: 'hover:bg-gray-50',
        };
      case 'facebook':
        return {
          icon: <FaFacebook size={20} className="text-blue-600" />,
          text: 'Continue with Facebook',
          bgColor: 'bg-blue-600',
          textColor: 'text-white',
          borderColor: 'border-blue-600',
          hoverBg: 'hover:bg-blue-700',
        };
      default:
        return {
          icon: null,
          text: 'Continue',
          bgColor: 'bg-gray-600',
          textColor: 'text-white',
          borderColor: 'border-gray-600',
          hoverBg: 'hover:bg-gray-700',
        };
    }
  };

  const config = getProviderConfig();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex items-center justify-center gap-3 px-4 py-3 
        border rounded-lg transition-all duration-200 font-medium
        ${config.bgColor} ${config.textColor} ${config.borderColor} ${config.hoverBg}
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      `}
    >
      {config.icon}
      <span>{config.text}</span>
    </button>
  );
};

export default SocialLoginButton; 