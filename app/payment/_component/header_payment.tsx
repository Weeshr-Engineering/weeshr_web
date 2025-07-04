// components/header.tsx

"use client";

import { useEffect, useState } from "react";
import { useUserAgent } from "next-useragent";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
        src='/logo.svg'
        alt="Logo"
        className=" md:hidden"
        width={100}
        height={24}
        priority
      />
      <Image
        src='/logo-white.svg'
        alt="Logo"
        className="hidden md:block"
        width={100}
        height={24}
        priority
      />
      <Button
        size={"customSec"}
        variant="secondary"
        className="flex justify-between pl-4 rounded-full bg-[#E9F4D1]"
      >
        <h3>Download</h3>{" "}
        {ua.isIos ? (
          <Icon
            icon="ion:logo-apple-appstore"
            width="35"
            height="35"
            className="text-[#34389B]"
          />
        ) : ua.isMac ? (
          <Icon
            icon="ion:logo-apple-appstore"
            width="35"
            height="35"
            className="text-[#34389B]"
          />
        ) : (
          <Icon
            icon="ion:logo-google-playstore"
            width="25"
            height="25"
            className="text-[#34389B] "
          />
        )}
      </Button>
    </div>
  );
};
export default Header;
