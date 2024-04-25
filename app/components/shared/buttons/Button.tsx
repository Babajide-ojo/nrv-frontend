"use client"
import React, { forwardRef, ButtonHTMLAttributes, useState, ReactElement } from 'react';
import { cls } from '../../../../helpers/utils';
import { IconType } from 'react-icons';
import { BsDownload } from 'react-icons/bs';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'darkPrimary' | 'light' | 'lightPrimary' | 'whitebg' | 'bluebg';
  size?: 'small' | 'normal' | 'large';
  pill?: boolean;
  icon?: IconType | ReactElement; // Allowing IconType or JSX elements
  showIcon?: boolean;
}

const classes = {
  base: 'focus:outline-none transition ease-in-out duration-300',
  disabled: 'opacity-50 cursor-not-allowed',
  pill: 'rounded',
  size: {
    small: 'px-3.5 py-1.5 text-sm',
    normal: 'px-3.5 py-1.5 text-sm',
    large: 'px-6 py-3 text-md'
  },
  variant: {
    primary:
      'rounded rounded-full hover:text-white hover:bg-nrvDarkBlue border border-nrvDarkBlue outline-none text-nrvDarkBlue bg-white',
    darkPrimary: 'rounded rounded-full outline-none bg-nrvDarkBlue text-white',
    light: 'rounded rounded-full bg-white text-nrvDarkBlue',
    lightPrimary : 'rounded rounded-full text-white border border-white bg-nrvDarkBlue',
    whitebg: 'font-light bg-white text-nrvLightGrey rounded rounded-md border border-nrvLightGrey',
    bluebg: 'font-light text-white bg-nrvDarkBlue rounded rounded-md'
  }
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      type = 'button',
      className,
      variant = 'primary',
      size = 'normal',
      pill,
      disabled = false,
      icon: Icon = BsDownload,
      showIcon = true,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <button
        ref={ref}
        disabled={disabled}
        type={type}
        className={cls(`
                ${classes.base}
                ${classes.size[size]}
                ${classes.variant[variant]}
                ${pill && classes.pill}
                ${disabled && classes.disabled}
                ${className}
            `)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        <div className="flex items-center justify-center">
        <span>{children}</span>
          {showIcon && !isHovered && typeof Icon === 'function' && <Icon className="ml-2" />} {/* Render icon if provided, not hovered, and it's a function */}
        </div>
      </button>
    );
  }
);

Button.displayName = 'Button'; 
export default Button;
