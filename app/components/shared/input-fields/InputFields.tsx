import Image from "next/image";
import React, { ChangeEventHandler } from "react";

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  name: string;
  value: string | number;
  icon?: string | React.ReactNode;
  isDisabled?: boolean;
  error?: string | null;
  inputType?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onClick?: () => void;
  onWheel?: () => void;
  onKeyPress?: (e: any) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  css?: string;
  required?: boolean;
}

export default function InputField({
  label,
  placeholder,
  name,
  value,
  icon,
  isDisabled,
  error,
  inputType,
  onWheel,
  onKeyPress,
  onChange,
  onClick,
  onBlur,
  css,
  required,
}: InputFieldProps) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col w-full">
        <div className="flex flex-col justify-center mb-4">
          <div className="flex flex-col w-full">
            <label
              htmlFor={name}
              className="flex flex-wrap gap-1 items-center w-full"
            >
              <span className="text-black font-medium">{label}</span>
              {required && (
                <span className="self-stretch my-auto w-2 text-red-600 whitespace-nowrap">
                  *
                </span>
              )}
            </label>
            <div
              className={`flex gap-5 items-center px-3 py-3 mt-1 w-full bg-swBgGray2 rounded-md border ${
                error ? "border-red-700" : "border-[#9da3af]"
              } text-zinc-400`}
            >
              <input
                type={inputType ? inputType : "text"}
                name={name}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyPress}
                onWheel={onWheel}
                onBlur={onBlur}
                placeholder={placeholder}
                className={`w-full my-auto bg-transparent border-none focus:outline-none border-1 ${css && css}`}
                disabled={isDisabled}
                onClick={() => onClick && onClick()}
              />
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
