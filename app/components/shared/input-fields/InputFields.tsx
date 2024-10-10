import React, { ChangeEvent, FocusEvent, useState } from "react";
import Image from "next/image";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";

interface InputFieldProps {
  css?: string;
  label?: string;
  placeholder?: string;
  inputType?: string;
  borderColor?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  name?: string;
  disabled?: boolean;
  error?: string;
  ariaLabel?: string;
  onWheel?: (event: React.WheelEvent<HTMLInputElement>) => void;
  icon?: any;
  unit?: string;
  password?: boolean;
  required?: boolean;
  onBlur?: (e: FocusEvent<HTMLInputElement, Element>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  css,
  label,
  placeholder,
  inputType,
  onChange,
  value,
  name,
  disabled,
  error,
  ariaLabel,
  onWheel,
  icon,
  unit,
  password,
  required,
  onBlur,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputStyles = `font-light w-full h-10 px-3 py-2 ${css} ${
    error ? "border-red-500" : "border-nrvLightGrey"
  }`;

  return (
    <div className="">
      {label && (
        <label htmlFor={name} className="text-nrvGreyBlack mb-2 text-sm">
          {label}
        </label>
      )}
      <div
        className={`relative border border-nrvLightGrey pl-2 mt-2 relative flex items-center cursor-pointer rounded-lg overflow-hidden  focus:outline-none cursor-pointer `}
      >
        {icon && (
          <div className="w-6 h-6 mr-2 flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          type={password ? (showPassword ? "text" : "password") : inputType}
          id={name}
          name={name}
          placeholder={placeholder}
          className={`${css} bg-none font-light w-full h-10 py-2 focus:outline-none`}
          onChange={onChange}
          value={value}
          disabled={disabled}
          onWheel={onWheel}
          aria-label={ariaLabel}
          onBlur={onBlur}
        />
        {password && (
          <div
            className="absolute right-2 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <IoEyeOutline
                height={24}
                width={24}
                style={{ width: "100%", height: "auto" }}
              />
            ) : (
              <IoEyeOffOutline
                height={24}
                width={24}
                style={{ width: "100%", height: "auto" }}
              />
            )}
          </div>
        )}
        {unit && <span className="ml-2 text-gray-500">{unit}</span>}
      </div>
      {error && <div className="text-red-500 font-light text-xs mt-1">{error}</div>}
    </div>
  );
};

export default InputField;
