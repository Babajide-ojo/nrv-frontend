import React, { useState, ChangeEventHandler } from "react";
import Image from "next/image";
import Flag from "react-world-flags";
import { FaCheck, FaExclamationCircle } from "react-icons/fa";
import { MdOutlineLock, MdOutlineMail } from "react-icons/md";
import EyeOpenIcon from "../icons/EyeOpenIcon";
import EyeIcon from "../icons/EyeIcon";

type InputFieldVariant = "flat" | "nested";

interface InputFieldProps {
  label?: string | React.ReactNode;
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
  variant?: InputFieldVariant;
  ariaLabel?: any;
  required?: boolean;
  readOnly?: boolean;
}

const countryOptions: any = [{ code: "+234", country: "NG" }];

const inputTextClass =
  "w-full text-base font-normal text-[#1E293B] bg-transparent border-none focus:outline-none placeholder:text-[#94A3B8] disabled:cursor-not-allowed disabled:opacity-60";

const getFieldShellClass = ({
  hasError,
  isFocused,
  variant,
}: {
  hasError: boolean;
  isFocused: boolean;
  variant: InputFieldVariant;
}) => {
  const isNested = variant === "nested";
  const base = isNested
    ? "flex items-center gap-3 w-full rounded-md bg-white border px-3 py-2.5 min-h-[44px] transition-all duration-150"
    : "flex items-center gap-3 w-full rounded-[10px] px-4 py-3.5 min-h-[52px] transition-all duration-150";

  if (hasError) {
    return `${base} ${
      isNested
        ? "border-red-300 focus-within:border-red-400"
        : "bg-[#FEF2F2] border border-red-300 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100"
    }`;
  }

  if (isFocused) {
    return `${base} border-[#CBD5E1] ${
      isNested ? "" : "bg-white ring-2 ring-[#03442C]/10"
    }`;
  }

  if (isNested) {
    return `${base} border-[#E2E8F0] focus-within:border-[#CBD5E1]`;
  }

  return `${base} bg-white border border-[#E2E8F0] focus-within:border-[#CBD5E1] focus-within:ring-2 focus-within:ring-[#03442C]/10`;
};

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
  variant: variantProp,
  required,
  readOnly,
}: InputFieldProps) {
  const [isValid, setIsValid] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const variant: InputFieldVariant =
    variantProp ?? (css?.includes("bg-nrvLightGreyBg") ? "nested" : "flat");
  const extraClass = css?.replace("bg-nrvLightGreyBg", "").trim() ?? "";

  const resolvedError = error || inputError;
  const hasError = Boolean(resolvedError);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputValue = e.target.value;

    if (onChange) {
      onChange(e);
    }

    if (inputError) {
      setInputError(null);
    }

    if (inputType === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailPattern.test(inputValue);
      setIsValid(isValidEmail);
      setInputError(isValidEmail || !inputValue ? null : "Invalid email format.");
    }

    if (inputType === "nin") {
      if (/^\d{11}$/.test(inputValue)) {
        setIsValid(true);
        setInputError(null);
      } else {
        setIsValid(false);
        setInputError("NIN must be exactly 11 digits.");
      }
    }

    if (inputType === "phone") {
      const phoneNumber = inputValue.replace(/\D/g, "");

      if (phoneNumber.startsWith("0")) {
        if (phoneNumber.length === 11) {
          setIsValid(true);
          setInputError(null);
        } else {
          setIsValid(false);
          setInputError(
            "Phone number must be exactly 11 digits if it starts with 0.",
          );
        }
      } else if (phoneNumber.length === 10) {
        setIsValid(true);
        setInputError(null);
      } else {
        setIsValid(false);
        setInputError(
          "Phone number must be exactly 10 digits if it does not start with 0.",
        );
      }
    }
  };

  const renderLeftAdornment = () => {
    const adornment = startIcon ?? icon;

    if (adornment) {
      if (typeof adornment === "string") {
        return (
          <Image
            src={adornment}
            alt=""
            width={18}
            height={18}
            className="shrink-0 opacity-80"
          />
        );
      }

      return (
        <span className="shrink-0 flex items-center text-[#94A3B8]">
          {adornment}
        </span>
      );
    }

    if (inputType === "email") {
      return <MdOutlineMail size={20} className="shrink-0 text-[#94A3B8]" />;
    }

    if (password) {
      return <MdOutlineLock size={20} className="shrink-0 text-[#94A3B8]" />;
    }

    return null;
  };

  const resolvedInputType = password
    ? showPassword
      ? "text"
      : "password"
    : inputType === "email"
      ? "email"
      : inputType || "text";

  const shellClass = getFieldShellClass({ hasError, isFocused, variant });

  const renderStandardField = () => (
    <div className={shellClass} onClick={onClick}>
      {renderLeftAdornment()}

      <input
        id={name}
        type={resolvedInputType}
        name={name}
        value={value}
        onChange={handleInputChange}
        onKeyDown={onKeyPress}
        onWheel={onWheel}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        placeholder={placeholder}
        className={inputTextClass}
        disabled={disabled}
        readOnly={readOnly}
        aria-label={ariaLabel}
      />

      {inputType === "email" && isValid && !hasError && (
        <FaCheck className="text-green-600 w-4 h-4 shrink-0" />
      )}

      {password && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="shrink-0 text-[#94A3B8] hover:text-[#64748B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#03442C]/20 rounded p-0.5"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeIcon fillColor="#94A3B8" />
          ) : (
            <EyeOpenIcon fillColor="#94A3B8" />
          )}
        </button>
      )}
    </div>
  );

  const renderPhoneField = () => (
    <div
      className={shellClass}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <div className="flex items-center gap-2 pr-2 border-r border-[#E2E8F0]">
        <Flag code={countryOptions[0].country} className="w-5 h-4 rounded" />
        <span className="text-[#1E293B] font-medium text-sm">
          {countryOptions[0].code}
        </span>
      </div>

      <input
        id={name}
        type="tel"
        name={name}
        value={value}
        onChange={handleInputChange}
        onKeyDown={onKeyPress}
        onWheel={onWheel}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        className={inputTextClass}
        disabled={disabled}
        onClick={onClick}
        aria-label={ariaLabel}
      />
    </div>
  );

  const renderNinField = () => (
    <div
      className={shellClass}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <input
        id={name}
        type="text"
        name={name}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
        }}
        placeholder="Enter your NIN"
        maxLength={11}
        pattern="\d{11}"
        className={inputTextClass}
        disabled={disabled}
        aria-label={ariaLabel}
      />
      {hasError ? (
        <FaExclamationCircle className="text-red-500 w-4 h-4 shrink-0" />
      ) : isValid ? (
        <FaCheck className="text-green-600 w-4 h-4 shrink-0" />
      ) : null}
    </div>
  );

  const labelNode = label ? (
    <label
      htmlFor={name}
      className={`flex items-center gap-1 ${
        variant === "nested" ? "mb-2" : "mb-2"
      }`}
    >
      <span className="text-sm font-medium text-[#4A5568]">{label}</span>
      {required && <span className="text-red-500">*</span>}
    </label>
  ) : null;

  const fieldBody =
    inputType === "phone"
      ? renderPhoneField()
      : inputType === "nin"
        ? renderNinField()
        : renderStandardField();

  if (variant === "nested") {
    return (
      <div className={`font-jakarta w-full ${extraClass}`}>
        {labelNode}
        {fieldBody}
        {resolvedError && (
          <p className="mt-1.5 text-xs text-red-600">{resolvedError}</p>
        )}
      </div>
    );
  }

  return (
    <div className={`font-jakarta flex flex-col w-full ${extraClass}`}>
      {labelNode}
      {fieldBody}
      {resolvedError && (
        <p className="mt-1.5 text-xs text-red-600">{resolvedError}</p>
      )}
    </div>
  );
}
