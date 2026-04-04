"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getVerificationCreditBalances } from "@/helpers/verificationCredits";
import { BiLogOut } from "react-icons/bi";
import {
  FiHome,
  FiUsers,
  FiClipboard,
  FiDollarSign,
  FiFileText,
  FiTool,
  FiMessageSquare,
  FiHeadphones,
  FiSettings,
} from "react-icons/fi";
import { BsPersonFill } from "react-icons/bs";
import { clearAllStoredData } from "@/helpers/utils";
import { LANDLORD_NAV_ITEMS } from "@/app/config/landlordNav";

interface User {
  name: string;
  role: string;
}

interface LandLordSideBarProps {
  isOpen: boolean;
}

const ICONS: Record<string, React.ReactNode> = {
  "Dashboard": <FiHome />,
  "Properties": <FiClipboard />,
  "Leads & Applications": <FiFileText />,
  "Tenants": <FiUsers />,
  "Tenant Verification": <FiDollarSign />,
  "Maintenance": <FiTool />,
  "Messages": <FiMessageSquare />,
  "Buy verification credit": <FiSettings />,
};

const links = LANDLORD_NAV_ITEMS.map(({ name, route }) => ({
  name,
  route,
  icon: ICONS[name] ?? <FiSettings />,
}));

const LandLordSideBar: React.FC<LandLordSideBarProps> = ({ isOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const userFromRedux = useSelector((s: RootState) => s.user.data);
  const [user, setUser] = useState<User | null>(null);
  const [activeLink, setActiveLink] = useState<string>("");
  const [creditLine, setCreditLine] = useState<{ standard: number; premium: number } | null>(
    null,
  );

  const creditsFromRedux = useMemo(() => {
    const doc = userFromRedux?.user ?? null;
    if (!doc || !(doc as { _id?: string })._id) return null;
    return getVerificationCreditBalances(doc);
  }, [userFromRedux]);

  const displayCredits = creditsFromRedux ?? creditLine;

  const readCreditsFromStorage = () => {
    try {
      const storedUser = localStorage.getItem("nrv-user");
      if (!storedUser) {
        setCreditLine(null);
        return;
      }
      const u = JSON.parse(storedUser)?.user;
      if (!u) {
        setCreditLine(null);
        return;
      }
      const standard = Math.max(
        0,
        (Number(u.standardVerificationBalance) || 0) - (Number(u.standardVerificationUsed) || 0),
      );
      const premium = Math.max(
        0,
        (Number(u.premiumVerificationBalance) || 0) - (Number(u.premiumVerificationUsed) || 0),
      );
      setCreditLine({ standard, premium });
    } catch {
      setCreditLine(null);
    }
  };

  useEffect(() => {
    setActiveLink(window.location.pathname);
    try {
      const storedUser = localStorage.getItem("nrv-user");
      if (storedUser) {
        const userInfo = JSON.parse(storedUser);
        if (userInfo) {
          setUser({
            name:
              `${userInfo?.user?.firstName} ${userInfo?.user?.lastName}` || "User",
            role: userInfo?.user?.accountType || "Property Owner",
          });
        }
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      // Clear invalid data
      localStorage.removeItem("nrv-user");
    }
    readCreditsFromStorage();
  }, []);

  useEffect(() => {
    readCreditsFromStorage();
  }, [pathname]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "nrv-user") readCreditsFromStorage();
    };
    const onUserUpdated = () => readCreditsFromStorage();
    window.addEventListener("storage", onStorage);
    window.addEventListener("nrv-user-updated", onUserUpdated);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("nrv-user-updated", onUserUpdated);
    };
  }, []);

  return (
    <div
      className={`h-full w-full bg-nrvPrimaryGreen text-white flex flex-col justify-between`}
    >
      {/* <div
      className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#0D3520] text-white flex flex-col justify-between transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    > */}
      <div>
        {/* Brand */}
        <div
          className="text-start mt-8 lg:mt-10 px-4 w-full min-w-0 box-border flex cursor-pointer items-center"
          onClick={() => router.push("/")}
        >
          <span className="text-white font-bold text-lg sm:text-xl tracking-tight leading-tight">
            NaijaRentVerify
          </span>
        </div>

        {displayCredits && (
          <Link
            href="/dashboard/landlord/settings/plans"
            className="block mx-4 mt-5 px-3 py-2.5 rounded-lg bg-white/10 border border-white/10 hover:bg-white/15 transition-colors"
          >
            <p className="text-[10px] uppercase tracking-wide text-white/60 mb-1">
              Verification credits
            </p>
            <p className="text-xs font-medium text-white leading-snug">
              Standard {displayCredits.standard}
              <span className="text-white/50 mx-1">·</span>
              Premium {displayCredits.premium}
            </p>
          </Link>
        )}

        {/* Navigation Links */}
        <nav className="mt-6">
          <ul className="font-lighter text-[12px] text-[#98A2B3]">
            {links.map(({ name, route, icon }, index) => (
              <li
                key={index}
                onClick={() => router.push(route)}
                className={`flex items-center gap-4 px-6 py-3 mx-4 rounded-lg cursor-pointer font-lighter text-[12px]  ${
                  activeLink === route ? "text-[#BBFF37]" : "text-[#98A2B3]"
                }`}
              >
                {icon} {name}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Support, Settings, and User Info */}
      <div className="px-6 py-4 border-t border-gray-600">
        <div className="flex items-center gap-4 mb-4 cursor-pointer font-lighter text-[12px] text-[#98A2B3]">
          <FiHeadphones className="font-lighter text-[12px] text-[#98A2B3]" />{" "}
          <span>Contact Support</span>
        </div>
        <div className="flex items-center gap-4 mb-6 cursor-pointer font-lighter text-[12px] text-[#98A2B3]">
          <FiSettings className="font-lighter text-[12px] text-[#98A2B3]" />{" "}
          <span>System Settings</span>
        </div>
        {user && (
          <div className="flex items-center gap-4 justify-between">
            <div className="flex gap-1.5">
              <BsPersonFill />
              <div>
                <p className="text-xs font-semibold text-[#FFFFFF]">
                  {user.name}
                </p>
                <p className="text-xs text-green-400">{user.role}</p>
              </div>
            </div>
            <BiLogOut
              onClick={() => {
                clearAllStoredData();
                router.push("/sign-in");
              }}
              className="text-xl cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LandLordSideBar;
