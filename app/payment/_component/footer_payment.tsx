import React from "react";
import Image from "next/image";

// Define the type for social media links
interface SocialMediaLink {
  name: string;
  url: string;
  icon: string;
}

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

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
      
    <footer className="bg-[#F8F9FF] flex flex-col md:flex-row justify-center md:justify-between w-full px-6 py-10  bottom-0  xl:relative
items-center ">
      <div className="flex md:justify-start mb-6 md:mb-0 md:pl-10 lg:pl-20">
        <Image
          alt="Weeshr Logo"
          src='/logo.svg'
          width={80}
          height={60}
          priority
        />
      </div>

      <div className="md:flex md:flex-row-reverse md:items-center md:w-[70%] md:justify-around">
        <ul className="flex justify-center mb-4 lg:space-x-4 md:mb-0">
          {socialMediaLinks.map((link) => (
            <li key={link.name}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <Image
                  src={link.icon}
                  alt={link.name}
                  width={43}
                  height={43}
                  className="transition-opacity duration-300 hover:opacity-80 md:w-12 md:h-12"
                />
              </a>
            </li>
          ))}
        </ul>

        <h4 className="text-xs text-center text-[#020721] md:text-sm">
          ©&nbsp;{currentYear} Weeshr App Limited. All rights reserved
        </h4>
      </div>
    </footer>
 
  );
};

export default Footer;
