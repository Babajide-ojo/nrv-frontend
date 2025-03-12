/* eslint-disable react/display-name */
import React, { forwardRef, AnchorHTMLAttributes } from "react";
import Link, { LinkProps } from "next/link";
import { cls } from "../../../../helpers/utils";

interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  activeClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ children, href, className, activeClassName }) => (
    <Link href={href} passHref>
      <div
        style={{ borderColor: "#153969" }}
        className={cls(`text-nrvLightGreyText font-light hover:font-medium hover:text-nrvPrimaryGreen
          ${className}
          ${
            activeClassName && location.pathname === href ? activeClassName : ""
          }
        `)}
        // onMouseEnter={(e) => {
        //     (e.target as HTMLAnchorElement).style.borderBottomWidth = '2px';
        //   }}
        //   onMouseLeave={(e) => {
        //     (e.target as HTMLAnchorElement).style.borderBottomWidth = '0px';
        //   }}


      >
        {children}
      </div>
    </Link>
  )
);

export default NavLink;
