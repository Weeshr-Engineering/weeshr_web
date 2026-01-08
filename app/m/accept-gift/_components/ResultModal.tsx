"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";

interface ResultModalProps {
  open: boolean;
  onClose: () => void;
  isSuccess: boolean;
  message: string;
}

export default function ResultModal({
  open,
  onClose,
  isSuccess,
  message,
}: ResultModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md bg-white rounded-3xl border-none shadow-2xl p-8 w-[97%] sm:w-full">
        <div className="flex flex-col items-center space-y-6">
          {/* Image */}
          <div className="w-full flex justify-center">
            <Image
              src={
                isSuccess
                  ? "https://res.cloudinary.com/drykej1am/image/upload/v1746962436/weehser%20pay/GiftIllustration_ojatmt.png"
                  : "https://res.cloudinary.com/drykej1am/image/upload/v1746961505/weehser%20pay/Illustration_1_c0tedl.png"
              }
              alt={isSuccess ? "Success" : "Error"}
              width={200}
              height={200}
              className="object-contain"
              priority
            />
          </div>

          {/* Message */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">{message}</h2>
          </div>

          {/* Close Button */}
          <Button
            onClick={onClose}
            className="w-full h-12 rounded-full bg-[#4145A7] hover:bg-[#4145A7]/90 text-white font-medium"
          >
            {isSuccess ? "Done" : "Try Again"}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
