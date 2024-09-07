"use client";

import { useEffect, useState } from "react";
import { useUserAgent } from "next-useragent";
import { Icon } from "@iconify/react";
import Image from "next/image";

const Header = ({ uaString }: { uaString?: string }) => {
  const [mounted, setMounted] = useState(false);
  const ua = useUserAgent(
    uaString ||
      (typeof window !== "undefined" ? window.navigator.userAgent : "")
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a loading placeholder
  }

  return (
    <div className="w-full max-w-5xl flex items-center justify-between font-mono text-sm min-h-20 px-2 pr-4 py-12 pb-10">
      <Image
        src="https://res.cloudinary.com/dufimctfc/image/upload/v1723267395/Weeshr_Logo_-_White_BG_ducgo9.png"
        alt="Logo"
        className="md:hidden "
        width={80}
        height={24}
        priority
      />
      <Image
        src="https://res.cloudinary.com/dufimctfc/image/upload/v1723970335/Logo_klw83c.svg"
        alt="Logo"
        className="hidden md:block"
        width={100}
        height={24}
        priority
      />

      {/* Container for the centered content */}
      <div className="container mx-auto bg-[white] rounded-xl p-0">
        <div className="flex space-x-4 md:space-x-7 py-2 lg:py-4 justify-center items-center">
          <a href="/" className="text-[#252432] text-xs md:text-sm hover:text-[#AEE219]">
            Home
          </a>
          <a href="/" className="text-[#252432] text-xs md:text-sm hover:text-[#AEE219]">
            About
          </a>
          <a href="/" className="text-[#252432] text-xs md:text-sm hover:text-[#AEE219]">
            How it Works
          </a>
          <a href="/" className="text-[#252432] text-xs md:text-sm hover:text-[#AEE219]">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
