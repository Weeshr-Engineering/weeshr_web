"use client";

import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import LoginSidePanel from "./LoginSidePanel";
import ReceiverInfoModal from "./ReceiverInfoModal";
import { BasketItem } from "@/lib/BasketItem";
import { Product } from "@/service/product.service";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import axios from "axios";
import toast from "react-hot-toast";

interface LoginDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  basketTotal: number;
  basketCount: number;
  basket: BasketItem[];
  products: Product[];
}

export default function LoginDialog({
  open,
  setOpen,
  basketTotal,
  basketCount,
  basket,
  products,
}: LoginDialogProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showReceiverModal, setShowReceiverModal] = useState(false);
  const [receiverName, setReceiverName] = useState("Dorcas");

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
  };

  // Close all modals
  const closeAllModals = () => {
    setShowReceiverModal(false);
    setOpen(false);
  };

  // Reset states when modal closes
  useEffect(() => {
    if (!open) {
      setShowReceiverModal(false);
    }
  }, [open]);

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      const authToken = localStorage.getItem("authToken");
      if (authToken && open) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          if (response.status === 200 || response.status === 201) {
            // User is already authenticated, show receiver modal directly
            setShowReceiverModal(true);
          }
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem("authToken");
          localStorage.removeItem("userId");
        }
      }
    };

    checkAuthStatus();
  }, [open]);

  return (
    <>
      {/* Login/Signup Modal */}
      <AlertDialog open={open && !showReceiverModal} onOpenChange={setOpen}>
        <AlertDialogContent
          onCloseRequest={() => setOpen(false)}
          className="border-none bg-transparent shadow-none flex items-center justify-center max-w-4xl w-[95%] md:mt-14"
        >
          <div className="w-full flex flex-col md:flex-row gap-4">
            {/* Left Side - Login/Signup Form */}
            <div className="flex-1 md:w-[55%]">
              {isLogin ? (
                <LoginForm
                  onToggleMode={handleToggleMode}
                  onSuccess={() => setShowReceiverModal(true)}
                />
              ) : (
                <SignupForm
                  onToggleMode={handleToggleMode}
                  onSuccess={() => setShowReceiverModal(true)}
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

      {/* Receiver Info Modal - Shows after successful login/signup */}
      <ReceiverInfoModal
        open={showReceiverModal}
        setOpen={setShowReceiverModal}
        basketTotal={basketTotal}
        basketCount={basketCount}
        receiverName={receiverName}
        basket={basket}
        products={products}
        onCloseAll={closeAllModals}
      />
    </>
  );
}
