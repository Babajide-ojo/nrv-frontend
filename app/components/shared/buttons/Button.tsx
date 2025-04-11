"use client";
import React, { forwardRef, useState, ReactElement } from "react";
import { cls } from "../../../../helpers/utils";
import { IconType } from "react-icons";
import { BsDownload } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa"; // Import spinner icon
import { FaCircleNotch } from "react-icons/fa6";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "lightPrimary"
    | "darkPrimary"
    | "light"
    | "whitebg"
    | "bluebg"
    | "lightGrey"
    | "mediumGrey"
    | "ordinary"
    | "roundedRec"
    | "transparentBg"
    | "lemonPrimary";
  size?: "small" | "normal" | "large" | "smaller" | "minLarge";
  pill?: boolean;
  icon?: IconType | ReactElement; // Allowing IconType or JSX elements
  showIcon?: boolean;
  isLoading?: boolean; // New prop to indicate loading state
}

const classes = {
  base: "focus:outline-none transition ease-in-out duration-300",
  disabled: "cursor-not-allowed",
  pill: "rounded",
  size: {
    smaller: "px-2 py-1.5 text-xs",
    small: "px-3.5 py-1.5 text-[10px]",
    normal: "px-3.5 py-1.5 text-xs",
    minLarge: "px-5 py-3 text-[16px] font-lighter",
    large: "px-8 py-3 text-[12px]",
  },
  variant: {
    primary:
      "rounded-full hover:text-nrvPrimaryGreen hover:bg-nrvLightGreenButtonHover1 border border-nrvPrimaryGreen outline-none text-nrvPrimaryGreen bg-white",
    lemonPrimary:
      "rounded-full hover:text-nrvPrimaryGreen hover:bg-nrvLightGreenButtonHover1 border border-nrvPrimaryGreen outline-none text-nrvPrimaryGreen bg-[#E9F4E7]",
    transparentBg:
      "rounded-full border border-nrvLightGreenButtonHover1 outline-none text-white bg-transparent",
    darkPrimary:
      "rounded-full text-white bg-nrvPrimaryGreen outline-none hover:text-nrvPrimaryGreen hover:bg-nrvLightGreenButtonHover1",
    light:
      "rounded-full bg-white border border-[#ECECEE] text-nrvPrimaryGreen",
    lightPrimary:
      "rounded-2xl text-white border border-white bg-nrvPrimaryGreen",
    whitebg:
      "font-light bg-white text-nrvLightGrey rounded rounded-lg border border-nrvLightGrey hover:bg-nrvPrimaryGreen hover:text-white",
    bluebg: "font-light text-white bg-nrvPrimaryGreen rounded rounded-lg",
    lightGrey:
      "rounded rounded-xxl text-nrvPrimaryGreen border border-[#153969] hover:bg-nrvPrimaryGreen hover:text-white",
    mediumGrey:
      "rounded-md bg-nrvLightGreyBg border border-nrvPrimaryGreen hover:bg-nrvPrimaryGreen hover:text-white",
    ordinary:
      "rounded-xl text-nrvLightGrey hover:bg-nrvPrimaryGreen hover:text-white",
    roundedRec:
      "font-light rounded-lg border border-nrvLightGrey hover:text-white hover:bg-nrvPrimaryGreen",
  },
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      type = "button",
      className,
      variant = "primary",
      size = "normal",
      pill,
      disabled = false,
      icon: Icon = BsDownload,
      showIcon = true,
      isLoading = false, // New loading prop
      onClick = () => {},
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <button
        ref={ref}
        disabled={isLoading} // Disable button during loading
        type={type}
        className={cls(`
                ${classes.base}
                ${classes.size[size]}
                ${classes.variant[variant]}
                ${pill && classes.pill}
                ${(disabled || isLoading) && classes.disabled}
                ${className}
            `)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        {...props}
      >
        <div className="flex items-center justify-center">
          {isLoading ? (
            <FaCircleNotch
              color="#ffffff"
              className="h-[25px] w-[25px] animate-spin"
            /> // Show the Spinner component
          ) : (
            <>
              <span>{children}</span>
            </>
          )}
        </div>
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
