"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

interface LoginSidePanelProps {
  isLogin: boolean;
}

export default function LoginSidePanel({ isLogin }: LoginSidePanelProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="hidden md:flex flex-1 relative h-full">
      {/* Background Image Container */}
      <div className="absolute inset-0 bg-gray-100 rounded-3xl overflow-hidden">
        {/* Shimmer skeleton while loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer z-10" />
        )}

        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{
            opacity: imageLoaded ? 1 : 0,
            scale: imageLoaded ? 1 : 1.05,
          }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="w-full h-full"
        >
          <Image
            src="https://res.cloudinary.com/drykej1am/image/upload/v1723760346/weeshr_website/owcdkhmybidka83hiksb.png"
            alt="weeshr side panel"
            fill
            className="object-cover"
            priority
            onLoad={() => setImageLoaded(true)}
          />
        </motion.div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 rounded-3xl z-10" />

      {/* Content */}
      <Card className="h-full bg-transparent border-none shadow-2xl rounded-3xl relative w-full">
        <CardContent className="h-full flex flex-col p-8 relative z-10 text-white">
          {/* Weeshr Logo - Aligned to right */}
          <div className="flex justify-start mb-8">
            <Image
              alt="Weeshr Logo"
              src="https://res.cloudinary.com/drykej1am/image/upload/v1697377875/weehser%20pay/Weeshr_Light_lrreyo.svg"
              width={120}
              height={40}
              className="ml-auto"
            />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center space-y-8">
            {/* Gift Box Image */}

            {/* Progress indicator */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
