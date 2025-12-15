"use client";
import { FloatingNav } from "@/components/commons/floating-navbar";
import Footer from "@/components/commons/footer-primary";
import HeaderMobile from "@/components/commons/header-mobile";
import WidthLayout from "@/components/commons/width-layout";
import { navigationLinks } from "@/lib/constants/navigation-items";
import Image from "next/image";
import { motion } from "framer-motion";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative overflow-auto h-screen w-full"
    >
      <Image
        src="https://res.cloudinary.com/drykej1am/image/upload/v1757702126/weeshr-marketplace/Desktop_-_19_jcvfpg.png"
        alt="Marketplace Background"
        fill
        priority
        quality={100}
        className="object-cover object-top -z-10"
      />
      {children}
    </motion.main>
  );
};

export default LandingLayout;
