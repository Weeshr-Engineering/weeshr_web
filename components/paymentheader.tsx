"use client";

import { useEffect, useState } from "react";
import { useUserAgent } from "next-useragent";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Button } from "./ui/button";

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
    <div className="z-10 w-full max-w-5xl flex items-center justify-between font-mono text-sm min-h-20 px-2 pr-4 py-12 pb-10">
      <Image
        src="https://res.cloudinary.com/dufimctfc/image/upload/v1723267395/Weeshr_Logo_-_White_BG_ducgo9.png"
        alt="Logo"
        className=" md:hidden"
        width={100}
        height={24}
        priority
      />
      <Image
        src="https://res.cloudinary.com/drykej1am/image/upload/v1697377875/weehser%20pay/Weeshr_Light_lrreyo.svg"
        alt="Logo"
        className="hidden md:block"
        width={100}
        height={24}
        priority
      />
       <Button
        size="secondary"
        variant="secondary"
        className="flex justify-between pl-4 rounded-full"
      >
        <h3>Download</h3>{" "}
        {ua.isIos ? (
          <Icon
            icon="ion:logo-apple-appstore"
            width="35"
            height="35"
            className="text-primary"
          />
        ) : ua.isMac ? (
          <Icon
            icon="ion:logo-apple-appstore"
            width="35"
            height="35"
            className="text-primary"
          />
        ) : (
          <Icon
            icon="ion:logo-google-playstore"
            width="25"
            height="25"
            className="text-primary"
          />
        )}
      </Button>
    </div>
  );
};

export default Header;
