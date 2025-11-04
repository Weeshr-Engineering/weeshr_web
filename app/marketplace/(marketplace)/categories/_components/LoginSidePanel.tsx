"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface LoginSidePanelProps {
  isLogin: boolean;
}

export default function LoginSidePanel({ isLogin }: LoginSidePanelProps) {
  return (
    <div className="hidden md:block flex-1 relative">
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
      <Card className="h-full bg-transparent border-none shadow-2xl rounded-3xl relative">
        <CardContent className="h-full flex flex-col p-8 relative z-10 text-white">
          {/* Weeshr Logo - Aligned to right */}
          <div className="flex justify-end mb-8">
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

            {/* Basket total */}
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-3">
                ₦158,682.60
              </div>
              <div className="text-sm text-white/80">Total gift value</div>
            </div>

            {/* Progress indicator */}
         
          </div>

          {/* Weeshr Gist Section - At the base of the card */}
          <div className="w-full bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20 mt-auto">
            <h4 className="font-semibold text-white text-lg mb-2">
              Weeshr Gist
            </h4>
            <div className="text-white/90 text-sm">
              <p>If wishes were horses, we'd all be riding unicorns to work.</p>
              <span className="text-[#AEE219] font-medium mt-1 block">
                #WishfulThinking #Weeshr
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
