"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  return (
    <div className="pb-10">
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full mt-auto relative overflow-hidden rounded-[2rem]"
      >
        {/* Noisy Gradient Background */}
        <div className="absolute inset-0 opacity-95" />

        {/* Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.2] pointer-events-none mix-blend-overlay">
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <filter id="noiseFilter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                stitchTiles="stitch"
              />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto flex flex-row items-center justify-between gap-4 md:gap-6 p-6 md:px-10">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="https://res.cloudinary.com/drykej1am/image/upload/v1767562379/Group_319_zjfxkf.png"
                alt="Weeshr Logo"
                width={120}
                height={40}
                className="h-8 md:h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Footer Links - Middle */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link
              href="/contact"
              className="text-white/70 hover:text-white text-sm transition-colors duration-200 whitespace-nowrap"
            >
              Contact
            </Link>
            <span className="text-white/30">•</span>
            <Link
              href="/privacy-policy"
              className="text-white/70 hover:text-white text-sm transition-colors duration-200 whitespace-nowrap"
            >
              Privacy Policy
            </Link>
            <span className="text-white/30">•</span>
            <Link
              href="/terms-and-conditions"
              className="text-white/70 hover:text-white text-sm transition-colors duration-200 whitespace-nowrap"
            >
              Terms and Conditions
            </Link>
            <span className="text-white/30">•</span>
            <Link
              href="/account"
              className="text-white/70 hover:text-white text-sm transition-colors duration-200 whitespace-nowrap"
            >
              Account
            </Link>
          </div>

          {/* Store Buttons */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 flex-row">
            <Link
              href="https://apps.apple.com/ng/app/weeshr/id6602884408"
              target="_blank"
              rel="noreferrer"
              className="transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg"
            >
              <Image
                src="https://res.cloudinary.com/drykej1am/image/upload/v1767562126/marketplace/Frame_28990_jxf7wp.png"
                alt="Download on the App Store"
                width={160}
                height={48}
                className="h-8 sm:h-10 md:h-12 w-auto"
              />
            </Link>
            <Link
              href="https://play.google.com/store/apps/details?id=com.app.weeshr&pcampaignid=web_share"
              target="_blank"
              className="transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg rounded-n"
              rel="noreferrer"
            >
              <Image
                src="https://res.cloudinary.com/drykej1am/image/upload/v1767562126/marketplace/Frame_28991_zwudyv.png"
                alt="Get it on Google Play"
                width={160}
                height={48}
                className="h-8 sm:h-10 md:h-12 w-auto"
              />
            </Link>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Footer;
