// footer_err

import React from "react";
import Image from "next/image";
import { Icon } from '@iconify/react'
// Define the type for social media links
interface SocialMediaLink {
  name: string;
  url: string;
  icon: string;
}

// Example social media links array
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
    <footer className="px-3 pt-4 lg:px-9  bg-[#F6F9FF] rounded-xl md:mb-8 md:mx-16">
      <div className="lg:flex items-center justify-between p-4 py-6 space-x-4 lg:space-x-6">
        <div className="">
          <a href="/" className="inline-flex items-center">
            <Image
               src="https://res.cloudinary.com/dufimctfc/image/upload/v1723970335/Logo_klw83c.svg"
               alt="logo"
              width={90} // Set the width property here
              height={80} // Set the height property here
            />
           
          </a>
          <div className="mt-6 lg:max-w-xl">
            <p className="text-sm text-gray-800">
            Weeshr helps you collect your birthday gifts with<br/> the click of one button from your friends, fans and family!
            </p>
          </div>
        </div>

       

        <div className="justify-end py-4">
          
          <div className="flex items-center gap-1 px-2">
            <a href="#" className="w-full min-w-xl">
            <Image
                src="https://res.cloudinary.com/dufimctfc/image/upload/v1723963363/App_Store_quvm85.svg"
                alt="Apple store"
                width={110} // Set the width property here
                height={80} // Set the height property here // Set the height property here
              />
              
            </a>
            <a
              className="w-full min-w-xl"
              href="/"
            >
              <Image
                src="https://res.cloudinary.com/dufimctfc/image/upload/v1723963374/Google_Play_zlkalx.svg"
                alt="Playstore Button"
                width={110} // Set the width property here
                height={80} // Set the height property here
              />
            </a>
          </div>
          <div className="flex  space-x-3 md:space-x-7 py-4 lg:py-5 px-2 ">
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
      </div>

      <div className="flex flex-col items-center md:flex-row md:justify-between pt-5 pb-10">
  <div className="text-sm text-[#020721] flex items-center">
 
    <Icon icon="mingcute:love-fill" width="24px" height="24px" color="#4145A7" />
    
    <p className="mx-2">Powered by Weeshr Core</p>
  </div>
  <div className="flex flex-wrap items-center mb-3 space-y-2  sm:space-y-0 space-x-8">
    <Icon icon="mdi:instagram" width="24px" height="24px" color="#151515" />
    <Icon icon="mdi:heart-outline" width="24px" height="24px" color="#151515" />
    <Icon icon="ic:baseline-tiktok" width="24px" height="24px" color="#151515" />
    <Icon icon="prime:twitter" width="24px" height="24px" color="#151515" />
  </div>
</div>

    </footer>
  );
};

export default Footer;
