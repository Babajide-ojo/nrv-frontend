import React, { ChangeEvent, FocusEvent, useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import classNames from "classnames";

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
  icon?: React.ReactNode;
  unit?: string;
  password?: boolean;
  required?: boolean;
  onBlur?: (e: FocusEvent<HTMLInputElement, Element>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  css = "",
  label,
  placeholder,
  inputType = "text",
  onChange,
  value,
  name,
  disabled = false,
  error,
  ariaLabel,
  onWheel,
  icon,
  unit,
  password = false,
  required = false,
  onBlur,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const inputClasses = classNames(
    "font-light text-sm w-full h-10 outline-none box-border",
    css,
    {
      "border-red-500": error,
      "border-nrvLightGrey": !error,
      "cursor-not-allowed bg-nrvGreyMediumBg": disabled,
    }
  );

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className={classNames("text-nrvGreyBlack font-400 mb-2 text-xs", {
            "cursor-not-allowed": disabled,
          })}
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative border border-nrvGreyMediumBg pl-2 mt-2 flex items-center rounded-lg overflow-hidden">
        {icon && <div className="w-5 h-5 mr-2 flex items-center justify-center">{icon}</div>}
        <input
          type={password ? (showPassword ? "text" : "password") : inputType}
          id={name}
          name={name}
          placeholder={placeholder}
          className={inputClasses}
          onChange={onChange}
          value={value}
          disabled={disabled}
          onWheel={onWheel}
          aria-label={ariaLabel}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          onBlur={onBlur}
    
        />
        {password && (
          <div className="absolute right-2 cursor-pointer" onClick={togglePasswordVisibility}>
            {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
          </div>
        )}
        {unit && <span className="ml-2 text-gray-500">{unit}</span>}
      </div>
      {error && <div id={`${name}-error`} className="text-red-500 font-light text-xs mt-1">{error}</div>}
    </div>
  );
};

export default InputField;
