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
import toast from "react-hot-toast";

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
  const placeholders = [
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
          placeholders={placeholders}
          onChange={(e) => setReceiverName(e.target.value)}
          onSubmit={onFormSubmit}
          value={receiverName}
        />
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
