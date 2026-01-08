"use client";

import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface ChangeReceiverDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  receiverName: string;
  setReceiverName: (name: string) => void;
  handleSubmit: () => void;
  disabled?: boolean;
}

export default function ChangeReceiverDialog({
  open,
  setOpen,
  receiverName,
  setReceiverName,
  handleSubmit,
  disabled = false,
}: ChangeReceiverDialogProps) {
  const [isGiftingMyself, setIsGiftingMyself] = useState(false);

  const defaultPlaceholders = [
    "Enter receiver's name",
    "Gift someone special 🎁",
    "Type a friend's name...",
    "Who’s the lucky person? ✨",
    "Surprise someone today 🎉",
    "Add a name to start gifting",
    "Search for a loved one ❤️",
    "Who deserves a treat? 🍫",
    "Enter a colleague’s name 👔",
    "Make someone smile 😊",
  ];

  const selfGiftingPlaceholders = [
    "You entering your own name, ya dig? 😉",
    "Treat yourself, you deserve it! 👑",
    "Self-love is the best love ❤️",
    "Who's a good human? You are! 🌟",
    "Time for a little self-care ✨",
    "Adding yourself to the nice list 🎅",
    "Spoil yourself today! 🍫",
    "Your future self will thank you 🎁",
    "You're the lucky person today! 🍀",
    "Make yourself smile 😊",
  ];

  const handleGiftMyself = () => {
    const nextState = !isGiftingMyself;
    setIsGiftingMyself(nextState);
    setReceiverName("");
  };

  const onFormSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (receiverName.trim().length < 2) {
      toast.error("Name must be at least 2 characters long");
      return;
    }
    handleSubmit();
  };

  const Trigger = (
    <button
      disabled={disabled}
      type="button"
      className={cn(
        "flex flex-row gap-1 items-center text-sm hover:bg-gray-50 transition-colors duration-200 py-2 rounded-lg cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
      )}
    >
      <div className="border-[#6A70FF] border-2 rounded-md p-0.5 w-6">
        <Icon icon="lsicon:switch-outline" />
      </div>
      <span>Change receiver</span>
    </button>
  );

  const Content = (
    <Card className="w-full max-w-sm bg-white/80 backdrop-blur-sm shadow-lg px-0 rounded-3xl bg-[#E9F4D1] border-none relative">
      <button
        onClick={() => setOpen(false)}
        className="absolute right-4 top-4 p-1 hover:bg-black/5 rounded-full transition-colors z-10"
      >
        <Icon icon="mdi:close" className="w-5 h-5 text-gray-500" />
      </button>

      <CardHeader className="px-5 py-4">
        <CardTitle className="text-xl text-primary text-left p-0">
          <span className="relative text-primary pr-1 font-normal">
            Who would you like to
            <span
              className="relative whitespace-nowrap px-2 bg-gradient-custom bg-clip-text text-transparent text-xl sm:text-xl"
              style={{
                fontFamily:
                  "var(--font-playwrite), 'Playwrite CU', cursive, sans-serif",
              }}
            >
              gift?
            </span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-1 rounded-xl border-none">
        <PlaceholdersAndVanishInput
          placeholders={
            isGiftingMyself ? selfGiftingPlaceholders : defaultPlaceholders
          }
          onChange={(e) => setReceiverName(e.target.value)}
          onSubmit={onFormSubmit}
          value={receiverName}
        />

        {/* Gift Myself Button */}
        <div className="flex justify-left my-1 pl-3">
          <button
            type="button"
            onClick={handleGiftMyself}
            className="group flex items-center gap-2 px-1 py-1 rounded-full transition-all duration-300 ease-out"
          >
            <div className="w-5 h-5 rounded border-2 border-[#6A70FF] flex items-center justify-center bg-[#6A70FF]/10 relative overflow-hidden transition-colors duration-300">
              <AnimatePresence>
                {isGiftingMyself && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0, pathLength: 0 }}
                    animate={{ scale: 1, opacity: 1, pathLength: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    }}
                    className="bg-[#6A70FF] absolute inset-0 flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Icon
                        icon="lucide:check"
                        className="w-3.5 h-3.5 text-white"
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <span
              className={`text-[14px] transition-all duration-300 inline-flex items-center h-8 ${
                isGiftingMyself
                  ? "bg-gradient-custom bg-clip-text text-transparent font-normal overflow-visible"
                  : "font-medium text-primary/80 group-hover:text-primary"
              }`}
              style={{
                fontFamily: isGiftingMyself
                  ? "var(--font-playwrite), 'Playwrite CU', cursive, sans-serif"
                  : "inherit",
                lineHeight: "normal",
              }}
            >
              I am gifting myself
            </span>
          </button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{Trigger}</AlertDialogTrigger>

      <AlertDialogContent
        onCloseRequest={() => setOpen(false)}
        className="border-none bg-transparent shadow-none flex items-center justify-center px-4"
      >
        {Content}
      </AlertDialogContent>
    </AlertDialog>
  );
}
