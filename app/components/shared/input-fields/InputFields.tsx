import React, { useState, ChangeEventHandler } from "react";
import Image from "next/image";
import Flag from "react-world-flags";
import { FaCheck, FaExclamationCircle } from "react-icons/fa";
import EyeOpenIcon from "../icons/EyeOpenIcon";
import EyeIcon from "../icons/EyeIcon";

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  name: string;
  password?: boolean;
  value?: string | number;
  icon?: string | React.ReactNode;
  startIcon?: any | React.ReactNode;
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

const countryOptions: any = [{ code: "+234", country: "NG" }]; // Nigeria only

export default function InputField({
  label,
  placeholder,
  name,
  value,
  password,
  icon,
  startIcon,
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
  const [isValid, setIsValid] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]); // Default: Nigeria (+234)
  const [inputError, setInputError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputValue = e.target.value;
    
    if (onChange) onChange(e);
  
    // Clear error when user starts typing
    if (inputError) {
      setInputError(null);
    }
  
    // Email Validation
    if (inputType === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailPattern.test(inputValue);
      setIsValid(isValidEmail);
      setInputError(isValidEmail ? null : "Invalid email format.");
    }
  
    // NIN Validation (Nigeria)
    if (inputType === "nin") {
      if (/^\d{11}$/.test(inputValue)) {
        setIsValid(true);
        setInputError(null);
      } else {
        setIsValid(false);
        setInputError("NIN must be exactly 11 digits.");
      }
    }
  
    // Phone Number Validation (Nigeria)
    if (inputType === "phone") {
      const phoneNumber = inputValue.replace(/\D/g, ""); // Remove non-numeric characters
  
      if (phoneNumber.startsWith("0")) {
        if (phoneNumber.length === 11) {
          setIsValid(true);
          setInputError(null);
        } else {
          setIsValid(false);
          setInputError(
            "Phone number must be exactly 11 digits if it starts with 0."
          );
        }
      } else {
        if (phoneNumber.length === 10) {
          setIsValid(true);
          setInputError(null);
        } else {
          setIsValid(false);
          setInputError(
            "Phone number must be exactly 10 digits if it does not start with 0."
          );
        }
      }
    }
  };
  

  return (
    <div className="font-jakarta flex flex-col w-full">
      {/* Label */}
      <label htmlFor={name} className="flex gap-1 items-center w-full">
        <span className="text-[#807F94] text-[14px] font-medium">{label}</span>
        {required && <span className="text-red-600">*</span>}
      </label>

      {/* Phone Number Input */}
      {inputType === "phone" ? (
        <div
          className={`flex items-center px-3 py-3 mt-1 w-full rounded-lg border transition-all
            ${
              inputError
                ? "border-red-700"
                : isValid
                ? "border-green-500 shadow-lg"
                : "border-gray-300"
            }`}
        >
          {/* Country Code & Flag */}
          <div className="flex items-center gap-2 pr-4">
            <Flag code={selectedCountry.country} className="w-5 h-4 rounded" />
            <span className="text-green-700 font-medium">
              {selectedCountry.code}
            </span>
          </div>

          {/* Phone Input */}
          <input
            type="tel"
            name={name}
            value={value}
            onChange={handleInputChange}
            onKeyDown={onKeyPress}
            onWheel={onWheel}
            onBlur={onBlur}
            placeholder={placeholder}
            className="w-full font-light text-black bg-transparent border-none focus:outline-none pl-2"
            disabled={disabled}
            onClick={onClick}
            aria-label={ariaLabel}
          />
        </div>
      ) : inputType === "nin" ? (
        // NIN Input (Nigeria Only)
        <div
          className={`flex gap-5 items-center px-3 py-3 mt-1 w-full rounded-lg border transition-all
            ${
              inputError
                ? "border-red-700"
                : isValid
                ? "border-green-500 shadow-lg"
                : "border-gray-300"
            }`}
        >
          <input
            type="text"
            name={name}
            value={value}
            onChange={handleInputChange}
            placeholder="Enter your NIN"
            maxLength={11}
            pattern="\d{11}"
            className="w-full font-light text-black bg-transparent border-none focus:outline-none"
            disabled={disabled}
            aria-label={ariaLabel}
          />
          {inputError ? (
            <FaExclamationCircle className="text-red-600 w-4 h-4" />
          ) : isValid ? (
            <FaCheck className="text-green-500 w-3 h-3" />
          ) : null}
        </div>
      ) : (
        // Standard Input Field (including Email & Password)
        <div
          className={`flex gap-5 items-center px-3 py-3 mt-1 w-full rounded-lg border transition-all
            ${
              inputError
                ? "border-red-700"
                : isValid
                ? "border-green-500 shadow-lg"
                : "border-gray-300"
            }`}
        >
          {startIcon && inputType === "phone" && (
            <Flag code={startIcon} className="w-5 h-4 rounded" />
          )}
          {password == true && (
            <Image
              src="/images/password-icon.svg"
              alt="password-icon"
              width={16}
              height={16}
              className="icon"
            />
          )}

          <input
            type={password ? (showPassword ? "text" : "password") : "text"}
            name={name}
            value={value}
            onChange={handleInputChange}
            onKeyDown={onKeyPress}
            onWheel={onWheel}
            onBlur={onBlur}
            placeholder={placeholder}
            className="w-full font-light text-black bg-transparent border-none focus:outline-none"
            disabled={disabled}
            onClick={onClick}
            aria-label={ariaLabel}
          />

          {/* Show Check Icon for Email Validation */}
          {inputType === "email" && isValid && (
            <FaCheck className="text-green-500 w-4 h-4" />
          )}

          {/* Password Toggle Icon */}
          {password && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="focus:outline-none"
            >
              {showPassword ? <EyeIcon /> : <EyeOpenIcon />}
            </button>
          )}

          {icon && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="focus:outline-none"
            >
              {icon}
            </button>
          )}
        </div>
      )}

      {/* Error Message */}
      {inputError && (
        <div className="text-sm text-red-700 mt-1">{inputError}</div>
      )}

      {/* Error Message */}
      {error && <div className="text-sm text-red-700 mt-1">{error}</div>}
    </div>
  );
}
