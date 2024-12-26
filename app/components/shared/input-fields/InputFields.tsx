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
  password = false,
  onBlur,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const inputClasses = classNames(
    "font-normal w-full h-9 outline-none box-border bg-white",
    css,
    {
      "border-red-500": error,
      "border-nrvLightGrey": !error,
      "cursor-not-allowed bg-nrvGreyMediumBg": disabled,
    }
  );

  return (
    <div className="mb-4 relative">
      <div
        className="border border-[#a9b0ba] p-3 bg-white rounded-md relative"
      >
        <label
          htmlFor={name}
          className="block text-[10px] md:text-sm font-medium w-full text-nrvGreyBlack"
        >
          {label}
        </label>
        <div className="flex items-center relative">
          <input
            type={password ? (showPassword ? "text" : "password") : inputType}
            id={name}
            name={name}
            placeholder={placeholder}
            className={`w-full focus:outline-none text-nrvGrayText font-normal text-sm transform scale-85 ${inputClasses}`}
            onChange={onChange}
            value={value}
            disabled={disabled}
            onWheel={onWheel}
            aria-label={ariaLabel}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            onBlur={onBlur}
            style={{
              width: "100%",
              transformOrigin: "left"
            }}
          />
          {inputType == "password" && (
            <div
              className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <IoEyeOutline className="text-nrvDarkBlue text-xl" />
              ) : (
                <IoEyeOffOutline className="text-nrvDarkBlue text-xl" />
              )}
            </div>
          )}
        </div>

      </div>
      {error && <p className="text-red-500 text-[13px] mt-2">{error}</p>}
    </div>
  );
};

export default InputField;
