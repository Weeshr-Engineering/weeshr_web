// components/Footer.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const Footer = () => {
  const [isAndroid, setIsAndroid] = useState(false);

  const socialMediaLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/weeshrapp",
      icon: "https://res.cloudinary.com/drykej1am/image/upload/v1708288264/weeshr_website/FB_mufgbd.svg",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/weeshrapp/",
      icon: "https://res.cloudinary.com/drykej1am/image/upload/v1708288265/weeshr_website/IG_jw9rir.svg",
    },
    {
      name: "Twitter",
      url: "https://twitter.com/weeshrapp",
      icon: "https://res.cloudinary.com/drykej1am/image/upload/v1708288266/weeshr_website/X_vigvoj.svg",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/weeshrapp",
      icon: "https://res.cloudinary.com/drykej1am/image/upload/v1708288750/weeshr_website/Group_80_dhlm3v.svg",
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@weeshrapp",
      icon: "https://res.cloudinary.com/drykej1am/image/upload/v1708288501/weeshr_website/TiTokWeeshr_yvqc4r.svg",
    },
  ];

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsAndroid(/android/.test(userAgent));
  }, []);

  return (
    <div className="bg-background w-full font-mono text-sm px-7 py-5">
      <div className="flex flex-col items-center justify-between w-full px-6 md:flex-row">
        <div className="w-full md:w-auto flex justify-center md:justify-start">
          <Image
            alt="Weeshr Logo"
            src="https://res.cloudinary.com/dufimctfc/image/upload/v1723267395/Weeshr_Logo_-_White_BG_ducgo9.png"
            width={100}
            height={90}
          />
        </div>

        <h4 className="text-xs text-center md:text-sm py-4 w-full md:w-auto">
          © 2024 Weeshr. All rights reserved.
        </h4>

        <ul className="flex space-x-4 justify-center md:justify-end w-full md:w-auto">
          {socialMediaLinks.map((link) => (
            <li key={link.name}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <Image
                  height={60}
                  width={60}
                  src={link.icon}
                  alt={link.name}
                  className="inline-block transition-opacity duration-300 hover:opacity-80"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Footer;
