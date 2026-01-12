"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full p-4 h-screen relative overflow-hidden bg-[url('https://res.cloudinary.com/drykej1am/image/upload/v1727678040/weeshr_website/Home_W-BG_lshut6.png')] bg-cover bg-center">
      {/* 📌 BACKGROUND WATERMARK TEXT */}
      <div className="absolute top-[-5%] left-0 right-0 overflow-hidden pointer-events-none select-none z-0 opacity-[0.03] flex whitespace-nowrap leading-none items-center">
        <h1 className="text-[18vw] font-black uppercase tracking-tighter text-[#0A0D14]">
          404 • NOT FOUND • 404
        </h1>
      </div>

      {/* Squiggly SVG Decorations */}
      <div className="absolute top-[20%] left-[10%] w-48 h-48 opacity-20 pointer-events-none hidden lg:block">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <motion.path
            d="M10,80 Q30,20 50,80 T90,20"
            fill="none"
            stroke="#BAEF23"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center z-10"
      >
        <Image
          className="mb-8 h-auto w-64 md:w-80"
          src="/failed.svg"
          alt="404 Error"
          width={400}
          height={400}
          priority
        />
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <p className="text-3xl font-bold text-[#0A0D14] md:text-5xl tracking-tight">
            Lost in Space?
          </p>
          <p className="mt-4 text-md text-[#0A0D14]/60 md:text-lg max-w-md">
            The page you're looking for has vanished. Let's get you back to the
            magic.
          </p>
        </div>
        <Link href="/">
          <Button className="w-48 md:w-56 h-12 bg-[#0A0D14] hover:bg-[#0A0D14]/90 rounded-full text-md font-semibold text-white shadow-xl transition-all active:scale-95">
            Go Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
