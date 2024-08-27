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
        className=" md:hidden"
        width={100}
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
       

       <div className="flex  space-x-3 md:space-x-7 py-4 lg:py-5 px-2 justify-center items-center ">
          <a href="/" className=" text-[#8987A1] text-sm">
            Home
            </a>
            <a href="/" className="text-[#8987A1] text-sm">
              About
            </a>
          <a href="/" className="text-[#8987A1] text-sm">
            How it Works
          </a>
          <a href="/" className="text-[#8987A1] text-sm">
            Contact Us
          </a>

          </div>
    </div>
  );
};
export default Header;