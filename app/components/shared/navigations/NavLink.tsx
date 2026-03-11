/* eslint-disable react/display-name */
import React, { forwardRef, AnchorHTMLAttributes } from "react";
import { cls } from "../../../../helpers/utils";

interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  targetId: string; // ID of the section to scroll to
  activeClassName?: string;
  onAfterNavigate?: () => void;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ children, targetId, className, activeClassName, onAfterNavigate }, ref) => {
    const handleScroll = (e: React.MouseEvent) => {
      e.preventDefault();
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust offset if you have a fixed navbar
          behavior: "smooth",
        });
        onAfterNavigate?.();
      }
    };

    const baseClass = className
      ? `cursor-pointer ${className} ${activeClassName ?? ""}`.trim()
      : cls(
          `whitespace-nowrap text-[14px] text-nrvLightGreyText font-light hover:font-medium hover:text-nrvPrimaryGreen cursor-pointer ${activeClassName ?? ""}`
        );

    return (
      <a onClick={handleScroll} ref={ref} className={baseClass}>
        {children}
      </a>
    );
  }
);

export default NavLink;
