import React, { InputHTMLAttributes } from 'react';

interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const CheckBox: React.FC<CheckBoxProps> = ({ label, ...props }) => {
  return (
    <div className="inline-flex items-center">
      <label
        className="relative flex items-center mr-3 rounded-full cursor-pointer"
        htmlFor="ripple-on"
        data-ripple-dark="true"
      >
        <input
          id="ripple-on"
          type="checkbox"
          {...props}
          className="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-md border border-nrvPrimaryGreen transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-nrvPrimaryGreen before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-nrvPrimaryGreen checked:before:bg-nrvPrimaryGreen text-sm"
        />
        <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        </span>
      </label>
      <label
        className="mt-px font-light text-gray-700 text-sm cursor-pointer select-none"
        htmlFor="ripple-on"
      >
        {label}
      </label>
    </div>
  );
};

export default CheckBox;
