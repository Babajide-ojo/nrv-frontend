/* eslint-disable react/display-name */
import React, { forwardRef, AnchorHTMLAttributes } from "react";
import { cls } from "../../../../helpers/utils";

interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  targetId: string; // ID of the section to scroll to
  activeClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ children, targetId, className, activeClassName }, ref) => {
    const handleScroll = (e: React.MouseEvent) => {
      e.preventDefault();
      const targetElement = document.getElementById(targetId);

      console.log({targetElement});
      

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust offset if you have a fixed navbar
          behavior: "smooth",
        });
      }
    };

    return (
      <a
        onClick={handleScroll}
        ref={ref}
        className={cls(
          `text-[14px] text-nrvLightGreyText font-light hover:font-medium hover:text-nrvPrimaryGreen
          ${className} 
          ${activeClassName ? activeClassName : ""}`
        )}
      >
        {children}
      </a>
    );
  }
);

export default NavLink;
