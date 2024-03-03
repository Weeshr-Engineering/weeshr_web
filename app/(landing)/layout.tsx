import Image from 'next/image'
import { motion } from 'framer-motion'

const LandingLayout = ({ children }: { children: React.ReactNode }) => {


  const socialMediaLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/weeshrapp',
      icon: 'https://res.cloudinary.com/drykej1am/image/upload/v1708288264/weeshr_website/FB_mufgbd.svg',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/weeshrapp/',
      icon: 'https://res.cloudinary.com/drykej1am/image/upload/v1708288265/weeshr_website/IG_jw9rir.svg',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/weeshrapp',
      icon: 'https://res.cloudinary.com/drykej1am/image/upload/v1708288266/weeshr_website/X_vigvoj.svg',
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/weeshrapp',
      icon: 'https://res.cloudinary.com/drykej1am/image/upload/v1708288750/weeshr_website/Group_80_dhlm3v.svg',
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@weeshrapp',
      icon: 'https://res.cloudinary.com/drykej1am/image/upload/v1708288501/weeshr_website/TiTokWeeshr_yvqc4r.svg',
    },
  ];
  
  return (
    <main className="h-full bg-gradient-to-br from-[] from-5% via-white  via-0.11% to-[E4E6F5] to-99.89% overflow-auto overflow-x-hidden">
      <div
        className="h-full "
      >
        {children}
      </div>

      <div className="bg-[#4537BA] flex flex-row -translate-y-1 justify-between w-full px-6 py-10">
            <div className="md:w-[30%] flex justify-center">
              <Image
                alt="image"
                src="https://res.cloudinary.com/drykej1am/image/upload/v1697377875/weehser%20pay/Weeshr_Light_lrreyo.svg"
                width={100}
                height={90}
              ></Image>
            </div>

            <div className="md:flex md:flex-row-reverse  md:items-center md:w-[70%] md:justify-around">
  

            <ul className="flex space-x-0">
      {socialMediaLinks.map((link) => (
        <li key={link.name}>
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            <Image
            height={43}
            width={43}
              src={link.icon}
              alt={link.name}
              className="inline-block transition-opacity duration-300 hover:opacity-80 md:w-12"
            />
          </a>
        </li>
      ))}
    </ul>
       



              <h4 className="text-xs text-center md:text-sm ">@2024 Weeshr.ALL right reserved</h4>
            </div>
          </div>
    </main>
  );
};

export default LandingLayout;
