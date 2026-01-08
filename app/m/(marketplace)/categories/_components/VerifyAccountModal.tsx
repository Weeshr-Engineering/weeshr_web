"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetOverlay } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import axios from "axios";

interface VerifyAccountModalProps {
  open: boolean;
  onClose: () => void;
  email: string;
  phone: string;
  onVerificationSuccess: () => void;
  onEditProfile?: () => void;
}

export default function VerifyAccountModal({
  open,
  onClose,
  email,
  phone,
  onVerificationSuccess,
  onEditProfile,
}: VerifyAccountModalProps) {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Countdown timer
  useEffect(() => {
    if (open && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, open]);

  // Reset countdown when modal opens
  useEffect(() => {
    if (open) {
      setCountdown(120);
      setCode(["", "", "", "", ""]);
    }
  }, [open]);

  // Format countdown as M:SS
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle input change
  const handleInputChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) value = value[0];

    // Only allow alphanumeric characters
    if (!/^[a-zA-Z0-9]*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 5);
    if (!/^[a-zA-Z0-9]+$/.test(pastedData)) return;

    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);

    // Focus last filled input or next empty one
    const nextIndex = Math.min(pastedData.length, 4);
    inputRefs.current[nextIndex]?.focus();
  };

  // Handle verification
  const handleVerify = async () => {
    const verificationCode = code.join("");

    if (verificationCode.length !== 5) {
      toast.error("Please enter the complete 5-digit code");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/verify-user/${email}/${verificationCode}`
      );

      if (response.data.code === 200 || response.data.code === 201) {
        toast.success("Account verified successfully! 🎉");
        onVerificationSuccess();
        onClose();
      } else {
        toast.error(response.data.message || "Verification failed");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Verification failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    if (countdown > 0) {
      toast.error(
        `Please wait ${formatCountdown(countdown)} before requesting a new code`
      );
      return;
    }

    setIsResending(true);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/new-verification-link/${email}`
      );

      if (response.data.code === 200 || response.data.code === 201) {
        toast.success("New verification code sent!");
        setCountdown(120); // Reset countdown
        setCode(["", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        toast.error(response.data.message || "Failed to resend code");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to resend code. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
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
          Verify your{" "}
          <span
            className="bg-gradient-to-r from-[#00E19D] via-[#6A70FF] to-[#00BBD4] bg-clip-text text-transparent"
            style={{
              fontFamily:
                "var(--font-playwrite), 'Playwrite CU', cursive, sans-serif",
            }}
          >
            account
          </span>
        </h2>
      </div>

      {/* Message */}
      <div className="text-sm text-gray-600 text-center space-y-1">
        <p>
          We've sent a activation word to{" "}
          <span className="font-semibold text-black">{email}</span> and{" "}
          <span className="font-semibold text-black">{phone}</span>
        </p>
        {/* <button
          onClick={onEditProfile || onClose}
          className="text-[#6A70FF] hover:underline font-medium text-xs"
        >
          Edit profile
        </button> */}
      </div>

      {/* Code input boxes */}
      <div className="flex justify-center gap-3">
        {code.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className="w-16 h-16 text-center text-2xl font-semibold rounded-xl border-2 focus:border-[#6A70FF] focus:ring-2 focus:ring-[#6A70FF]/20"
          />
        ))}
      </div>

      {/* Resend message */}
      <div className="text-center text-sm text-gray-500">
        <p>Didn't receive a activation code?</p>
        <button
          onClick={handleResendCode}
          disabled={countdown > 0 || isResending}
          className={`font-medium ${
            countdown > 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-[#6A70FF] hover:underline"
          }`}
        >
          {isResending
            ? "Sending..."
            : countdown > 0
            ? `Request another in ${formatCountdown(countdown)}`
            : "Request another"}
        </button>
      </div>

      {/* Verify button */}
      <Button
        onClick={handleVerify}
        disabled={isVerifying || code.join("").length !== 5}
        className="w-full h-12 rounded-full bg-[#020721] hover:bg-[#020721]/90 text-white font-medium flex items-center justify-center gap-2"
      >
        {isVerifying ? (
          <Icon height={20} width={70} icon="eos-icons:three-dots-loading" />
        ) : (
          <>
            Verify Account
            <Icon icon="mdi:check-circle" className="w-5 h-5" />
          </>
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
