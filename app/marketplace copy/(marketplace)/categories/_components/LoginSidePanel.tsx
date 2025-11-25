"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface LoginSidePanelProps {
  isLogin: boolean;
}

export default function LoginSidePanel({ isLogin }: LoginSidePanelProps) {
  return (
    <div className="hidden md:flex flex-1 relative h-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center rounded-3xl"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/drykej1am/image/upload/v1723760346/weeshr_website/owcdkhmybidka83hiksb.png')`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 rounded-3xl" />

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
