"use client";

import { useState, useEffect } from "react";
import DesktopNavBar from "./DesktopNavBar";
import MobileNavBar from "./MobileNavBar";

const NavBar: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000); // Set isMobile to true if screen width is less than or equal to 1000px
    };

    const handleScroll = () => {
      // Detect if page is scrolled past 50px (adjustable threshold)
      setScrolling(window.scrollY > 50);
    };

    // Add event listener for window resize and scroll
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    // Call handleResize initially to set the correct initial state
    handleResize();

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full z-10 transition-all"
      style={{
        backgroundColor: scrolling ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 1)", // Apply opacity when scrolled
        backdropFilter: scrolling ? "backdrop-filter" : "none", // Optional: Add blur effect when scrolled
      }}
    >
      <div className="w-full gap-2 flex flex-col md:flex-row py-4">
        {isMobile ? <MobileNavBar /> : <DesktopNavBar />}
      </div>
    </div>
  );
};

export default NavBar;
