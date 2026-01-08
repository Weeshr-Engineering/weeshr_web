"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

interface PaymentSuccessModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  receiverName: string;
  address: string;
  deliveryDate: string;
  onCloseAll?: () => void;
  phoneNumber?: string;
}

export default function PaymentSuccessModal({
  open,
  setOpen,
  receiverName,
  address,
  deliveryDate,
  onCloseAll,
  phoneNumber,
}: PaymentSuccessModalProps) {
  const [confettiTriggered, setConfettiTriggered] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleClose = () => {
    setOpen(false);
    onCloseAll?.();
  };

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
    if (open && !confettiTriggered) {
      // Small delay to ensure modal is fully rendered
      const timer = setTimeout(() => {
        triggerConfetti();
        setConfettiTriggered(true);
      }, 300);

      return () => clearTimeout(timer);
    }

    // Reset confetti trigger when modal closes
    if (!open) {
      setConfettiTriggered(false);
    }
  }, [open, confettiTriggered]);

  const Content = (
    <Card className="w-full bg-white md:bg-white rounded-[32px] md:shadow-xl border-none overflow-hidden flex flex-col items-center justify-center py-10 relative">
      {/* Grab handle for mobile */}
      {isMobile && (
        <div className="w-12 h-1 bg-black/20 rounded-full mx-auto mb-6 shrink-0" />
      )}

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
        <h1 className="text-lg font-medium text-gray-800">
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
        {/* Address and Date */}
        <div className="space-y-3 text-center">
          {address ? (
            <div className="bg-[#F6F7FF] rounded-xl py-3 text-gray-700 text-sm font-normal">
              {address}
            </div>
          ) : (
            <div className="bg-[#F6F7FF] rounded-xl py-4 px-4 flex flex-col items-center justify-center gap-2">
              <p className="text-sm text-gray-600 flex items-center gap-1.5 flex-wrap justify-center">
                We'll contact{" "}
                <span className="font-semibold text-gray-900 capitalize">
                  {receiverName}
                </span>{" "}
                via <Icon icon="logos:whatsapp-icon" width="16" />
              </p>
              <p className="font-semibold text-gray-900 text-sm bg-white/50 px-3 py-1 rounded-full border border-gray-100">
                {phoneNumber}
              </p>
            </div>
          )}
          <div className="bg-[#F6F7FF] rounded-xl py-3 text-gray-800 text-sm ">
            {deliveryDate}
          </div>
        </div>

        {/* Tracking Info */}
        <div className="text-center space-y-5">
          <p className="text-sm text-gray-500">
            Login to app or check email to track
          </p>

          {/* App Store Buttons */}
          <div className="flex flex-row gap-3 justify-center">
            <Button
              variant="outline"
              className="h-14 rounded-xl bg-black text-white border-none flex items-center justify-center gap-3 hover:bg-gray-800 transition"
              onClick={() =>
                window.open(
                  "https://apps.apple.com/ng/app/weeshr/id6602884408",
                  "_blank"
                )
              }
            >
              <Icon icon="mdi:apple" className="w-6 h-6" />
              <div className="text-left leading-tight">
                <div className="text-xs">Download on the</div>
                <div className="text-sm font-semibold">App Store</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-14 rounded-xl bg-black text-white border-none flex items-center justify-center gap-3 hover:bg-gray-800 transition"
              onClick={() =>
                window.open(
                  "https://play.google.com/store/apps/details?id=com.app.weeshr&pcampaignid=web_share",
                  "_blank"
                )
              }
            >
              <Icon icon="mdi:google-play" className="w-6 h-6" />
              <div className="text-left leading-tight">
                <div className="text-xs">Get it on</div>
                <div className="text-sm font-semibold">Google Play</div>
              </div>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-[2.5rem] p-0 border-none outline-none overflow-y-auto max-h-[95vh]"
        >
          {Content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent
        onCloseRequest={handleClose}
        className="border-none shadow-none flex items-center justify-center max-w-md w-[95%] p-0 md:mt-14"
      >
        {Content}
      </AlertDialogContent>
    </AlertDialog>
  );
}
