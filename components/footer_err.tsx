import React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

interface SocialMediaLink {
  name: string;
  url: string;
  icon: string;
}

const socialMediaLinks: SocialMediaLink[] = [
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
    <footer className="px-4 pt-4 pb-6 lg:px-9 bg-[#F6F9FF] rounded-xl mb-6 mx-4 md:mb-8 md:mx-16">
      <div className="flex flex-col md:flex-row items-center justify-between p-4 py-6 md:space-x-4 lg:space-x-6">
        <div className="flex flex-col items-center md:items-start">
          <a href="/" className="inline-flex items-center">
            <Image
              src="https://res.cloudinary.com/dufimctfc/image/upload/v1723970335/Logo_klw83c.svg"
              alt="logo"
              width={90}
              height={80}
            />
          </a>
          <div className="mt-4 md:mt-2 lg:max-w-md text-center md:text-left">
            <p className="text-sm text-muted-foreground md:text-xs lg:text-sm">
              Weeshr helps you collect your birthday gifts with
              <br /> the click of one button from your friends, fans, and family!
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end mt-6 md:mt-0">
          <div className="flex items-center gap-2 px-2 mb-4">
            <a href="/" className="w-full md:w-auto">
              <Image
                src="https://res.cloudinary.com/dufimctfc/image/upload/v1723963363/App_Store_quvm85.svg"
                alt="Apple store"
                width={110}
                height={80}
              />
            </a>
            <a className="w-full md:w-auto" href="/">
              <Image
                src="https://res.cloudinary.com/dufimctfc/image/upload/v1723963374/Google_Play_zlkalx.svg"
                alt="Playstore Button"
                width={110}
                height={80}
              />
            </a>
          </div>
          <div className="flex space-x-3 md:space-x-7 lg:space-x-10 px-2">
            <a href="/" className="text-[#8987A1] text-sm">
              Home
            </a>
            <a href="/contact" className="text-[#8987A1] text-sm">
              Contact
            </a>
            <a href="/login" className="text-[#8987A1] text-sm">
              Login
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center md:flex-row md:justify-between pt-5 pb-6 md:pb-10 px-4">
        <div className="text-sm text-[#020721] flex items-center">
          <Icon icon="mingcute:love-fill" width="24px" height="24px" color="#4145A7" />
          <p className="mx-2">Powered by Weeshr Core</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
         <a href="https://www.instagram.com/weeshrapp/" target="_blank" rel="noopener noreferrer">
          <Icon icon="mdi:instagram" width="24px" height="24px" color="#151515" />
         </a>
         <a href="https://www.facebook.com/weeshrapp" target="_blank" rel="noopener noreferrer">
          <Icon icon="mdi:heart-outline" width="24px" height="24px" color="#151515" />
        </a>
        <a href="https://www.tiktok.com/@weeshrapp" target="_blank" rel="noopener noreferrer">
      <Icon icon="ic:baseline-tiktok" width="24px" height="24px" color="#151515" />
    </a>
    <a href="https://twitter.com/weeshrapp" target="_blank" rel="noopener noreferrer">
      <Icon icon="prime:twitter" width="24px" height="24px" color="#151515" />
    </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
