/* eslint-disable react/display-name */
import React, { forwardRef, AnchorHTMLAttributes } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cls } from "../../../../helpers/utils";

/** Set before `router.push("/")` so `NewLanding` can scroll after mount (sections only exist on home). */
export const LANDING_SCROLL_STORAGE_KEY = "nrv-landing-scroll";

interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  targetId: string; // ID of the section to scroll to
  activeClassName?: string;
  onAfterNavigate?: () => void;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ children, targetId, className, activeClassName, onAfterNavigate, ...rest }, ref) => {
    const pathname = usePathname();
    const router = useRouter();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const onHome = pathname === "/";

      if (onHome) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          });
        }
        onAfterNavigate?.();
        return;
      }

      try {
        sessionStorage.setItem(LANDING_SCROLL_STORAGE_KEY, targetId);
      } catch {
        // ignore private mode / quota
      }
      router.push("/");
      onAfterNavigate?.();
    };

    const baseClass = className
      ? `cursor-pointer ${className} ${activeClassName ?? ""}`.trim()
      : cls(
          `whitespace-nowrap text-[14px] text-nrvLightGreyText font-light hover:font-medium hover:text-nrvPrimaryGreen cursor-pointer ${activeClassName ?? ""}`
        );

    return (
      <a
        href={`/#${targetId}`}
        onClick={handleClick}
        ref={ref}
        className={baseClass}
        {...rest}
      >
        {children}
      </a>
    );
  }
);

export default NavLink;
