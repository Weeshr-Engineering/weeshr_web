// components/Header.tsx
"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

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
    <div className="bg-background w-full flex items-center justify-between flex-row font-mono text-sm   px-7 py-5 mb-6 ">
      <div className=" flex flex-row items-center justify-between w-full px-6 ">
        <div className="flex flex-col  items-center  justify-center w-full md:flex-row md:justify-between md:items-center md:px-10">
          <div className="w-full flex  items-center md:items-start flex-col">
            <Image
              alt="image"
              src="https://res.cloudinary.com/dufimctfc/image/upload/v1723267395/Weeshr_Logo_-_White_BG_ducgo9.png"
              width={100}
              height={90}
              className="pb-6 pt-4"
            ></Image>
            <h4 className="flex text-xs text-center md:text-sm pb-8 ">
              @ 2024 Weeshr. All right reserved.
            </h4>{" "}
          </div>

          <ul className="flex space-x-0 pb-16 md:pb-0">
            {socialMediaLinks.map((link) => (
              <li key={link.name}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <Image
                    height={60}
                    width={60}
                    src={link.icon}
                    alt={link.name}
                    className="inline-block transition-opacity duration-300 hover:opacity-80 "
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
