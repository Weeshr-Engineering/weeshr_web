import React from "react";
import Image from "next/image";
import { FloatingNav } from "./ui/floating-navbar";

// Define the type for social media links
interface SocialMediaLink {
  name: string;
  url: string;
  icon: string;
}

const navItems = [
  { name: "Home", link: "/" },
  { name: "Contact", link: "/contact" },
  // Add more items as needed
];
// You would typically define this array in a separate file or fetch it from an API
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

const Header: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <header className="flex flex-col justify-between w-full px-6 bg-transparent md:flex-row">
       <Image
        src="https://res.cloudinary.com/dufimctfc/image/upload/v1723267395/Weeshr_Logo_-_White_BG_ducgo9.png"
        alt="Logo"
        className=" md:hidden"
        width={100}
        height={24}
        priority
      />
    </header>
  );
};

export default Header;
