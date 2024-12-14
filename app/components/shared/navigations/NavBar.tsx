// NavBar.tsx
"use client";

import { useState, useEffect } from "react";
import DesktopNavBar from "./DesktopNavBar";
import MobileNavBar from "./MobileNavBar";

const NavBar: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Set isMobile to true if screen width is less than or equal to 768px
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Call handleResize initially to set the correct initial state
    handleResize();

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <div className="w-full gap-2 flex flex-col md:flex-row py-4 px-6 md:px-12">
    
        {isMobile ? (
          <MobileNavBar />
        ) : (
          <DesktopNavBar />
        )}
      </div>
    </div>
  );
};

export default NavBar;
