"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import EmptyBasket from "./empty-basket";
import { BasketItemCard } from "./basket-Item-card";
import { Product } from "@/service/product.service";
import { BasketItem } from "@/lib/BasketItem";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import LoginDialog from "./LoginDialog";
import ReceiverInfoModal from "./ReceiverInfoModal";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { cartService } from "@/service/cart.service";

interface GiftBasketProps {
  basket: BasketItem[];
  products: Product[];
  getBasketTotal: () => number;
  setBasket: React.Dispatch<React.SetStateAction<BasketItem[]>>;
}

export function GiftBasket({
  basket,
  products,
  getBasketTotal,
  setBasket,
}: GiftBasketProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [receiverModalOpen, setReceiverModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [receiverName, setReceiverName] = useState("Dorcas");
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [isProcessingCart, setIsProcessingCart] = useState(false);

  const clearBasket = () => setBasket([]);

  // Check authentication status and handle cart submission
  const handleSendBasket = async () => {
    setIsCheckingAuth(true);
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      try {
        // Verify token and get user profile
        const profileResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (profileResponse.status === 200 || profileResponse.status === 201) {
          setIsAuthenticated(true);

          // User is authenticated - send cart to backend
          await sendCartToBackend(profileResponse.data.data._id);
        } else {
          setIsAuthenticated(false);
          setLoginOpen(true); // Show login modal
        }
      } catch (error) {
        // Token is invalid, clear it
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
        setLoginOpen(true); // Show login modal
      }
    } else {
      setIsAuthenticated(false);
      setLoginOpen(true); // Show login modal
    }

    setIsCheckingAuth(false);
  };

  // Send cart items to backend API
  const sendCartToBackend = async (userId: string) => {
    setIsProcessingCart(true);

    try {
      // Prepare cart items for API
      const cartItems = basket.map((item) => ({
        productId: item.id.toString(), // Ensure productId is string
        quantity: item.qty,
      }));

      const cartData = {
        userId: userId,
        items: cartItems,
      };

      const result = await cartService.addItemsToCart(cartData);

      if (result.code === 200 || result.code === 201) {
        // Success - show toast and proceed to receiver modal
        toast.success("🎉 Basket sent successfully! Ready for payment.");
        setReceiverModalOpen(true);

        // Optional: Clear basket after successful submission
        // setBasket([]);
      } else {
        toast.error(
          result.message || "Failed to send basket. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Cart submission error:", error);
      toast.error("Failed to process your basket. Please try again.");
    } finally {
      setIsProcessingCart(false);
    }
  };

  const closeAllModals = () => {
    setLoginOpen(false);
    setReceiverModalOpen(false);
  };

  const handleLoginSuccess = async () => {
    setIsAuthenticated(true);
    setLoginOpen(false);

    // After successful login, get user profile and send cart
    try {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        const profileResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (profileResponse.status === 200 || profileResponse.status === 201) {
          await sendCartToBackend(profileResponse.data.data._id);
        }
      }
    } catch (error) {
      console.error("Error after login:", error);
      toast.error("Failed to process your basket after login.");
    }
  };

  return (
    <>
      <div className="border-0 rounded-2xl bg-background">
        <h3 className="font-normal pt-6 pb-2 w-full text-center">
          Gift basket
        </h3>
        <div className="min-h-[450px] p-4">
          {basket.length === 0 ? (
            <EmptyBasket />
          ) : (
            <div className="space-y-1 max-h-[420px] overflow-y-auto">
              <div className="flex justify-between px-1.5 text-xs items-center">
                <h5 className="text-sm">Your Items</h5>
                <Button
                  variant="ghost"
                  className="text-[#6A70FF] text-xs px-2 py-1 h-6 rounded-3xl"
                  onClick={clearBasket}
                >
                  Clear All
                </Button>
              </div>
              {basket.map((b) => (
                <BasketItemCard
                  key={b.id}
                  item={b}
                  products={products}
                  setBasket={setBasket}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-t-[1.5px] border-transparent [border-image:linear-gradient(to_right,#00E19D_0%,#6A70FF_36%,#00BBD4_66%,#AEE219_100%)_1] flex justify-between items-center px-4 py-3">
          <div>
            <h6 className="text-muted-foreground text-xs">Your basket</h6>
            <span className="font-semibold">
              ₦ {getBasketTotal().toLocaleString()}
            </span>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="default"
                disabled={
                  basket.length === 0 || isCheckingAuth || isProcessingCart
                }
                className="disabled:opacity-50 rounded-3xl px-1.5 text-xs flex py-1 h-7 space-x-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-[#4145A7] hover:to-[#5a5fc7]"
                onClick={handleSendBasket}
              >
                <>
                  <Badge
                    className="rounded-full bg-[#4145A7] p-0.5 text-sm w-5 h-5 flex justify-center"
                    title={`${basket.length} items`}
                  >
                    {basket.length}
                  </Badge>

                  <span className="font-medium">Send basket</span>

                  {isCheckingAuth || isProcessingCart ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Icon
                      icon="streamline-ultimate:shopping-basket-1"
                      className="text-white h-4 w-4"
                    />
                  )}
                </>
              </Button>
            </AlertDialogTrigger>
          </AlertDialog>
        </div>
      </div>

      {/* Show LoginDialog only when user is NOT authenticated and loginOpen is true */}
      <LoginDialog
        open={loginOpen && !isAuthenticated}
        setOpen={setLoginOpen}
        basketTotal={getBasketTotal()}
        basketCount={basket.length}
        basket={basket}
        products={products}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Show ReceiverInfoModal only when user IS authenticated and receiverModalOpen is true */}
      <ReceiverInfoModal
        open={receiverModalOpen && isAuthenticated}
        setOpen={setReceiverModalOpen}
        basketTotal={getBasketTotal()}
        basketCount={basket.length}
        receiverName={receiverName}
        basket={basket}
        products={products}
        onCloseAll={closeAllModals}
      />
    </>
  );
}
