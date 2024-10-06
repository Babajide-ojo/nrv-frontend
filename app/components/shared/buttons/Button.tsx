"use client"
import React, { forwardRef, ButtonHTMLAttributes, useState, ReactElement } from 'react';
import { cls } from '../../../../helpers/utils';
import { IconType } from 'react-icons'; 
import { BsDownload } from 'react-icons/bs';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'darkPrimary' | 'light' | 'lightPrimary' | 'whitebg' | 'bluebg' | 'lightGrey' | 'mediumGrey' | 'ordinary' | 'roundedRec';
  size?: 'small' | 'normal' | 'large' | 'smaller' | 'minLarge';
  pill?: boolean;
  icon?: IconType | ReactElement; // Allowing IconType or JSX elements
  showIcon?: boolean;
}

const classes = {
  base: 'focus:outline-none transition ease-in-out duration-300',
  disabled: 'opacity-50 cursor-not-allowed',
  pill: 'rounded',
  size: {
    smaller:'px-2.5 py-1 text-xs',
    small: 'px-3.5 py-1.5 text-sm',
    normal: 'px-3.5 py-1.5 text-sm',
    minLarge: 'px-5 py-2.5 text-[15px] font-lighter',
    large: 'px-5 py-2.5 text-lg'
  },
  variant: {
    primary:
      ' rounded-2xl hover:text-white hover:bg-nrvDarkBlue border border-nrvDarkBlue outline-none text-nrvDarkBlue bg-white',
    darkPrimary: ' rounded-2xl outline-none bg-nrvDarkBlue text-white',
    light: ' rounded-2xl bg-white text-nrvDarkBlue hover:bg-nrvDarkBlue hover:text-white',
    lightPrimary : ' rounded-2xl text-white border border-white bg-nrvDarkBlue',
    whitebg: 'font-light bg-white text-nrvLightGrey rounded rounded-lg border border-nrvLightGrey hover:bg-nrvDarkBlue hover:text-white',
    bluebg: 'font-light text-white bg-nrvDarkBlue rounded rounded-lg',
    lightGrey: 'rounded rounded-2xl text-nrvDarkBlue  border border-[#153969] hover:bg-nrvDarkBlue hover:text-white',
    mediumGrey: 'rounded-2xl  bg-nrvLightGreyBg border border-nrvDarkBlue hover:bg-nrvDarkBlue hover:text-white',
    ordinary: ' rounded-xl text-nrvLightGrey hover:bg-nrvDarkBlue hover:text-white',
    roundedRec: 'font-light rounded-lg border border-nrvLightGrey hover:text-white hover:bg-nrvDarkBlue'
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
      onClick = () => {},
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
        onClick={onClick}
        {...props}

      >
        <div className="flex items-center justify-center">
        <span>{children}</span>
        </div>
      </button>
    );
  }
);

Button.displayName = 'Button'; 
export default Button;
