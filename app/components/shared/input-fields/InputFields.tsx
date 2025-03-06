import React, { useState, ChangeEventHandler } from "react";
import Image from "next/image";
import EyeOpenIcon from "../icons/EyeOpenIcon";
import EyeIcon from "../icons/EyeIcon";

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  name: string;
  password?: boolean;
  value?: string | number;
  icon?: string | React.ReactNode;
  disabled?: boolean;
  error?: string | null;
  inputType?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onClick?: () => void;
  onWheel?: () => void;
  onKeyPress?: (e: any) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  css?: string;
  ariaLabel?: any;
  required?: boolean;
}

export default function InputField({
  label,
  placeholder,
  name,
  value,
  password,
  icon,
  disabled,
  error,
  inputType,
  onWheel,
  onKeyPress,
  onChange,
  onClick,
  onBlur,
  ariaLabel,
  css,
  required,
}: InputFieldProps) {
  // State to toggle password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Toggle the password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col w-full">
        <div className="flex flex-col justify-center mb-4">
          <div className="flex flex-col w-full">
            <label
              htmlFor={name}
              className="flex flex-wrap gap-1 items-center w-full"
            >
              <span className="text-nrvInputFiledColor text-[14px] font-medium">
                {label}
              </span>
              {required && (
                <span className="self-stretch my-auto w-2 text-red-600 whitespace-nowrap">
                  *
                </span>
              )}
            </label>
            <div
              className={`flex gap-5 items-center px-3 py-3 mt-1 w-full bg-swBgGray2 rounded-md border ${
                error ? "border-red-700" : "border-[#E0E0E6]"
              }`}
            >
              <input
                type={password && !isPasswordVisible ? "password" : "text"}
                name={name}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyPress}
                onWheel={onWheel}
                onBlur={onBlur}
                placeholder={placeholder}
                className={`w-full font-light text-black my-auto bg-transparent border-none focus:outline-none border-1 ${
                  css && css
                }`}
                disabled={disabled}
                onClick={() => onClick && onClick()}
                aria-label={ariaLabel}
              />

              {password && (
                <div
                  className="cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {isPasswordVisible ? <EyeIcon /> : <EyeOpenIcon />}
                </div>
              )}
              {icon && typeof icon === "string" ? (
                <Image
                  src={icon}
                  alt={`${name} icon`}
                  className="shrink-0 w-6 h-6"
                  width={24}
                  height={24}
                />
              ) : icon ? (
                icon
              ) : null}
            </div>
            {error && <div className="text-sm text-red-700 mt-1">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
