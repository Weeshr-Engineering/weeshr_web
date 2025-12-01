"use client";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import confetti from "canvas-confetti";

interface PaymentSuccessProps {
  paymentData: any;
  receiverName: string;
  address: string;
  deliveryDate: string;
}

export default function PaymentSuccess({
  paymentData,
  receiverName,
  address,
  deliveryDate,
}: PaymentSuccessProps) {
  const [confettiTriggered, setConfettiTriggered] = useState(false);

  const formattedDeliveryDate = useMemo(() => {
    const date = new Date(deliveryDate);
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [deliveryDate]);

  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 1000,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  useEffect(() => {
    if (!confettiTriggered) {
      const timer = setTimeout(() => {
        triggerConfetti();
        setConfettiTriggered(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [confettiTriggered]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-white/40 backdrop-blur-2xl">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-[32px] shadow-xl border-none overflow-hidden flex flex-col items-center justify-center py-10 relative">
        {/* Confetti container */}
        <div className="absolute inset-0 pointer-events-none z-0" />

        {/* Illustration */}
        <div className="flex justify-center mb-6 relative z-10">
          <Image
            src="https://res.cloudinary.com/drykej1am/image/upload/v1762336281/weeshr-marketplace/Event_management_brrg3c.png"
            alt="Gift on its way"
            width={200}
            height={200}
            className="object-contain"
            priority
          />
        </div>

        {/* Heading */}
        <CardHeader className="text-center space-y-1 px-6 relative z-10">
          <h1 className="text-lg text-primary">
            Yaaay!!!, the gift is on its way to
          </h1>
          <p
            className="relative whitespace-nowrap px-2 bg-gradient-custom bg-clip-text text-transparent italic font-semibold text-xl lg:text-2xl"
            style={{ fontFamily: "Playwrite CU, cursive" }}
          >
            {receiverName}
          </p>
        </CardHeader>

        <CardContent className="px-6 pb-6 w-full space-y-6 relative z-10">
          {/* Address + Date */}
          <div className="space-y-3 text-center">
            <div className="space-y-0.5">
              <div className="bg-[#F6F7FF] rounded-t-xl py-3 text-gray-700 text-sm font-normal">
                {address}
              </div>
              <div className="bg-[#F6F7FF] rounded-b-xl py-3 text-gray-800 text-sm">
                {formattedDeliveryDate}
              </div>
            </div>
          </div>

          {/* Tracking Info */}
          <div className="text-center space-y-5">
            <p className="text-sm text-gray-500">
              Login to app or check email to track
            </p>

            {/* ⭐ FIXED MOBILE DOWNLOAD BUTTONS ⭐ */}
            {/* App Store Buttons - Side by Side */}
            <div className="flex flex-row gap-2 justify-center w-full">
              <Button
                variant="outline"
                className="h-11 rounded-xl bg-black text-white border-none flex items-center justify-center gap-2 transition flex-1 px-3"
                onClick={() => console.log("App Store")}
              >
                <Icon icon="mdi:apple" className="w-5 h-5 flex-shrink-0" />
                <div className="text-left leading-tight">
                  <div className="text-[10px]">Download on the</div>
                  <div className="text-xs font-semibold">App Store</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-11 rounded-xl bg-black text-white border-none flex items-center justify-center gap-2 transition flex-1 px-3"
                onClick={() => console.log("Google Play")}
              >
                <Icon
                  icon="mdi:google-play"
                  className="w-5 h-5 flex-shrink-0"
                />
                <div className="text-left leading-tight">
                  <div className="text-[10px]">Get it on</div>
                  <div className="text-xs font-semibold">Google Play</div>
                </div>
              </Button>
            </div>

            {/* Continue Shopping */}
            <Button
              variant={"marketplace"}
              className="rounded-xl transition h-12 font-medium w-full"
              onClick={() => (window.location.href = "/marketplace")}
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
