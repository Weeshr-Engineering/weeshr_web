"use client";

import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { useState } from "react";
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
}

export default function LoginDialog({
  open,
  setOpen,
  basketTotal,
  basketCount,
  basket,
  products,
  onLoginSuccess,
}: LoginDialogProps) {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleSuccess = () => {
    onLoginSuccess?.(); // Call the success callback
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent
        onCloseRequest={() => setOpen(false)}
        className="border-none bg-transparent shadow-none flex items-center justify-center max-w-4xl w-[95%] md:mt-14"
      >
        <div className="w-full flex flex-col md:flex-row-reverse gap-4">
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
              />
            )}
          </div>

          {/* Right Side - Separate Component */}
          <div className="md:w-[45%] flex">
            <LoginSidePanel isLogin={isLogin} />
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
