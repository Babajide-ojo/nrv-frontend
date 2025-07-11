"use client";
import React, { forwardRef, memo, ReactElement } from "react";
import { cls } from "../../../../helpers/utils";
import { IconType } from "react-icons";
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
    | "orangeOutline"
    | "lemonPrimary";
  size?: "small" | "normal" | "large" | "smaller" | "minLarge";
  pill?: boolean;
  icon?: IconType | ReactElement;
  showIcon?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

// Memoized classes object to prevent recreation on every render
const classes = {
  base: "focus:outline-none transition ease-in-out duration-300",
  disabled: "cursor-not-allowed opacity-60",
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
    light: "rounded-full bg-white border border-[#ECECEE] text-nrvPrimaryGreen",
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
    orangeOutline:
      "border border-[#FFAA00] text-[#FFAA00] hover:bg-[#FFAA00]/20",
    roundedRec:
      "font-light rounded-lg border border-nrvLightGrey hover:text-white hover:bg-nrvPrimaryGreen",
  },
} as const;

// Memoized loading spinner component
const LoadingSpinner = memo(() => (
  <FaCircleNotch
    className="h-[25px] w-[25px] animate-spin"
    aria-label="Loading"
  />
));

LoadingSpinner.displayName = "LoadingSpinner";

// Helper function to render icon
const renderIcon = (icon: IconType | ReactElement | undefined, showIcon: boolean) => {
  if (!showIcon || !icon) return null;
  
  if (React.isValidElement(icon)) {
    return icon;
  }
  
  const IconComponent = icon as IconType;
  return <IconComponent className="mr-2" />;
};

const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        children,
        type = "button",
        className,
        variant = "primary",
        size = "normal",
        pill = false,
        disabled = false,
        icon,
        showIcon = false,
        isLoading = false,
        loadingText,
        onClick,
        ...props
      },
      ref
    ) => {
      const isDisabled = isLoading || disabled;
      const buttonText = isLoading && loadingText ? loadingText : children;

      const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (isDisabled) return;
        onClick?.(event);
      };

      return (
        <button
          ref={ref}
          disabled={isDisabled}
          type={type}
          className={cls(`
            ${classes.base}
            ${classes.size[size]}
            ${classes.variant[variant]}
            ${pill ? classes.pill : ''}
            ${isDisabled ? classes.disabled : ''}
            ${className || ''}
          `)}
          onClick={handleClick}
          aria-disabled={isDisabled}
          aria-busy={isLoading}
          {...props}
        >
          <div className="flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <LoadingSpinner />
                {buttonText && <span>{buttonText}</span>}
              </>
            ) : (
              <>
                {renderIcon(icon, showIcon)}
                {buttonText && <span>{buttonText}</span>}
              </>
            )}
          </div>
        </button>
      );
    }
  )
);

Button.displayName = "Button";

export default Button;
