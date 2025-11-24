"use client";

import { Icon } from "@iconify/react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

interface ChangeReceiverDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  receiverName: string;
  setReceiverName: (name: string) => void;
  handleSubmit: () => void;
}

export default function ChangeReceiverDialog({
  open,
  setOpen,
  receiverName,
  setReceiverName,
  handleSubmit,
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

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button className="flex flex-row gap-1 items-center text-sm hover:bg-gray-50 transition-colors duration-200 p-2 rounded-lg cursor-pointer">
          <div className="border-[#6A70FF] border-2 rounded-md p-0.5 w-6">
            <Icon icon="lsicon:switch-outline" />
          </div>
          <span>Change receiver</span>
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="border-none bg-transparent shadow-none flex items-center justify-center">
        <Card className="w-full max-w-sm bg-white/80 backdrop-blur-sm shadow-lg px-0 rounded-3xl bg-[#E9F4D1] border-none">
          <CardHeader className="px-5 py-4">
            <CardTitle className="text-xl text-primary text-left p-0">
              <span className="relative text-primary pr-1 font-normal">
                Who would you like to
                <span
                  className="relative whitespace-nowrap px-2 bg-gradient-custom bg-clip-text text-transparent text-xl sm:text-xl"
                  style={{ fontFamily: "Playwrite CU, sans-serif" }}
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
              onSubmit={handleSubmit}
              value={receiverName} // 👈 add this line
            />
          </CardContent>
        </Card>
      </AlertDialogContent>
    </AlertDialog>
  );
}
