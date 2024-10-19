"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export const LandingPageSectionTwo = () => {
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <motion.div
      className="relative flex items-center justify-center md:pt-20"
      variants={containerVariant}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariant} className="md:hidden w-full">
        <Image
          src="https://res.cloudinary.com/drykej1am/image/upload/v1727795807/weeshr_website/WeeshrShowM_qzd1ws.png"
          alt="Hero Image"
          width={200}
          height={100}
          className="object-cover w-full"
        />
      </motion.div>

      <motion.div variants={itemVariant} className="hidden md:block">
        <Image
          src="https://res.cloudinary.com/drykej1am/image/upload/v1727795805/weeshr_website/WeeshrMock_f6cn4l.png"
          alt="Hero Image"
          width={500}
          height={500}
          className="object-cover lg:w-[600px]"
        />
      </motion.div>
    </motion.div>
  );
};
