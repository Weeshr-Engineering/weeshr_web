"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import axios from "axios";

interface SetPinModalProps {
  open: boolean;
  onClose: () => void;
  email: string;
  onPinSetSuccess: () => void;
}

export default function SetPinModal({
  open,
  onClose,
  email,
  onPinSetSuccess,
}: SetPinModalProps) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [isSettingPin, setIsSettingPin] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Reset pin when modal opens
  useEffect(() => {
    if (open) {
      setPin(["", "", "", ""]);
      // Focus first input after a short delay
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [open]);

  // Handle input change
  const handleInputChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) value = value[0];

    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    if (!/^\d+$/.test(pastedData)) return;

    const newPin = [...pin];
    for (let i = 0; i < pastedData.length; i++) {
      newPin[i] = pastedData[i];
    }
    setPin(newPin);

    // Focus last filled input or next empty one
    const nextIndex = Math.min(pastedData.length, 3);
    inputRefs.current[nextIndex]?.focus();
  };

  // Handle set pin
  const handleSetPin = async () => {
    const pinCode = pin.join("");

    if (pinCode.length !== 4) {
      toast.error("Please enter a 4-digit PIN");
      return;
    }

    setIsSettingPin(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/register/set-pin`,
        {
          email: email,
          pin: pinCode,
        }
      );

      if (response.data.code === 200 || response.data.code === 201) {
        toast.success("PIN set successfully! 🎉");
        onPinSetSuccess();
        onClose();
      } else {
        toast.error(response.data.message || "Failed to set PIN");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to set PIN. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSettingPin(false);
    }
  };

  const Content = (
    <div className="space-y-6">
      {/* Grab handle for mobile */}
      {isMobile && (
        <div className="w-12 h-1 bg-black/20 rounded-full mx-auto mb-2" />
      )}

      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl font-normal">
          Set access{" "}
          <span
            className="bg-gradient-to-r from-[#00E19D] via-[#6A70FF] to-[#00BBD4] bg-clip-text text-transparent"
            style={{
              fontFamily:
                "var(--font-playwrite), 'Playwrite CU', cursive, sans-serif",
            }}
          >
            pin
          </span>
        </h2>
      </div>

      {/* Message */}
      <p className="text-sm text-gray-600 text-center">
        Create a passcode to access your weeshr account
      </p>

      {/* PIN input boxes */}
      <div className="flex justify-center gap-3">
        {pin.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className="w-16 h-16 text-center text-2xl font-semibold rounded-xl border-2 focus:border-[#6A70FF] focus:ring-2 focus:ring-[#6A70FF]/20"
          />
        ))}
      </div>

      {/* Continue button */}
      <Button
        onClick={handleSetPin}
        disabled={isSettingPin || pin.join("").length !== 4}
        className="w-full h-12 rounded-full bg-[#020721] hover:bg-[#020721]/90 text-white font-medium flex items-center justify-center gap-2"
      >
        {isSettingPin ? (
          <Icon height={20} width={70} icon="eos-icons:three-dots-loading" />
        ) : (
          "Continue to checkout"
        )}
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent
          side="bottom"
          className="rounded-t-[2.5rem] p-8 pb-10 border-none outline-none"
        >
          {Content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md bg-white rounded-3xl border-none shadow-2xl p-8">
        {Content}
      </AlertDialogContent>
    </AlertDialog>
  );
}
