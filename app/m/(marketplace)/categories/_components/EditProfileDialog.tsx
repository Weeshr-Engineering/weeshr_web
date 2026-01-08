"use client";

import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import SignupForm from "./SignupForm";
import { SignupFormData } from "@/service/auth.service";

interface EditProfileDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialData: SignupFormData | null;
  onSuccess: (
    email: string,
    phone: string,
    formData: SignupFormData,
    userId?: string,
    token?: string
  ) => void;
}

export default function EditProfileDialog({
  open,
  setOpen,
  initialData,
  onSuccess,
}: EditProfileDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent
        onCloseRequest={() => setOpen(false)}
        className="border-none bg-transparent shadow-none flex items-center justify-center max-w-lg w-[95%] p-0"
      >
        <div className="relative w-full">
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 p-2 hover:bg-black/5 rounded-full transition-colors z-[60]"
          >
            <Icon icon="mdi:close" className="w-6 h-6 text-gray-500" />
          </button>
          <SignupForm
            onToggleMode={() => {}} // No toggle in edit mode
            onSuccess={() => {}} // We use onSignupSuccess
            onSignupSuccess={onSuccess}
            initialData={initialData}
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
