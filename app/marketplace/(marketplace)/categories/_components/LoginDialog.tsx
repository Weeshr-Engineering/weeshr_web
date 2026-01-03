"use client";

import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState, useEffect } from "react";
import LoginSidePanel from "./LoginSidePanel";
import { BasketItem } from "@/lib/BasketItem";
import { Product } from "@/service/product.service";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface LoginDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  basketTotal: number;
  basketCount: number;
  basket: BasketItem[];
  products: Product[];
  onLoginSuccess?: () => void; // Add this prop
  onSignupSuccess?: (
    email: string,
    phone: string,
    formData: any,
    userId?: string,
    token?: string
  ) => void;
  initialMode?: "login" | "signup";
  initialSignupData?: any | null;
}

export default function LoginDialog({
  open,
  setOpen,
  basketTotal,
  basketCount,
  basket,
  products,
  onLoginSuccess,
  onSignupSuccess,
  initialMode,
  initialSignupData,
}: LoginDialogProps) {
  const [isLogin, setIsLogin] = useState(initialMode !== "signup");
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Sync mode when initialMode prop changes
  useEffect(() => {
    if (initialMode) {
      setIsLogin(initialMode === "login");
    }
  }, [initialMode]);

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleSuccess = () => {
    onLoginSuccess?.(); // Call the success callback
  };

  const Content = (
    <div className="w-full flex flex-col md:flex-row-reverse gap-4">
      {/* Grab handle for mobile */}
      {isMobile && (
        <div className="w-12 h-1 bg-black/20 rounded-full mx-auto mb-2 shrink-0" />
      )}

      {/* Left Side - Login/Signup Form */}
      <div className="flex-1 md:w-[55%]">
        {isLogin ? (
          <LoginForm
            onToggleMode={handleToggleMode}
            onSuccess={handleSuccess} // Pass the success handler
          />
        ) : (
          <SignupForm
            onToggleMode={handleToggleMode}
            onSuccess={handleSuccess} // Pass the success handler
            onSignupSuccess={onSignupSuccess!}
            initialData={initialSignupData}
          />
        )}
      </div>

      {/* Right Side - Separate Component (Desktop only) */}
      {!isMobile && (
        <div className="md:w-[45%] flex">
          <LoginSidePanel isLogin={isLogin} />
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-[2.5rem] p-6 pb-8 border-none outline-none max-h-[95vh] overflow-y-auto"
        >
          {Content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent
        onCloseRequest={() => setOpen(false)}
        className="border-none bg-transparent shadow-none flex items-center justify-center max-w-4xl w-[95%] md:mt-14"
      >
        {Content}
      </AlertDialogContent>
    </AlertDialog>
  );
}
