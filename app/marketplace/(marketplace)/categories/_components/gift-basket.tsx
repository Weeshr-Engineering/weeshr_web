// @ts-ignore
// @ts-nocheck
// @ts-expect-error

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
import VerifyAccountModal from "./VerifyAccountModal";
import SetPinModal from "./SetPinModal";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { cartService } from "@/service/cart.service";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  const [userId, setUserId] = useState<string | null>(null);
  const [receiverName, setReceiverName] = useState("Dorcas");
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [isProcessingCart, setIsProcessingCart] = useState(false);
  const [isClearingBasket, setIsClearingBasket] = useState(false); // New state specifically for clearing
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false); // Mobile basket sheet state
  const [showMobileBasket, setShowMobileBasket] = useState(true); // New state to control mobile basket visibility
  const [showVerifyModal, setShowVerifyModal] = useState(false); // Verification modal state
  const [showPinModal, setShowPinModal] = useState(false); // PIN modal state
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");

  // Filter basket to only show items with quantity >= 1 and price > 0
  const filteredBasket = basket.filter((item) => {
    const product = products.find((p) => p.id == item.id);
    const price = product?.price || 0;
    return item.qty >= 1 && price > 0;
  });

  // Clear basket - local state or API
  const clearBasket = async () => {
    // Store current basket for potential rollback
    const previousBasket = [...basket];

    // Clear UI immediately
    setBasket([]);
    setIsClearingBasket(true); // Set clearing state

    // Sync with API in background if authenticated
    if (isAuthenticated && userId) {
      try {
        const cartId = cartService.getCurrentCartId();
        if (cartId) {
          const result = await cartService.clearCart(cartId);
          if (!(result.code === 200 || result.code === 201)) {
            toast.error("Failed to clear cart on server");
            // Optional: Revert local state if API fails
            // setBasket(previousBasket);
          } else {
            toast.success("Cart cleared successfully");
          }
        }
      } catch (error) {
        toast.error("Failed to clear cart on server");
        // Optional: Revert local state if API fails
        // setBasket(previousBasket);
      } finally {
        setIsClearingBasket(false); // Clear clearing state
      }
    } else {
      // For guest users, just show success immediately
      toast.success("Cart cleared successfully");
      setIsClearingBasket(false); // Clear clearing state
    }
  };

  // Check authentication status and handle cart submission
  const handleSendBasket = async () => {
    setIsCheckingAuth(true);

    // Hide mobile basket when Send Basket is clicked
    setShowMobileBasket(false);

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
          const userData = profileResponse.data.data;
          setUserId(userData._id);
          setUserEmail(userData.email);
          setUserPhone(
            `${userData.phoneNumber.countryCode} ${userData.phoneNumber.phoneNumber}`
          );

          // Check if email is verified
          if (!userData.emailVerified) {
            // Email not verified - show verification modal
            toast.error("Please verify your email to continue");
            setShowVerifyModal(true);
            setIsCheckingAuth(false);
            return;
          }

          // User is authenticated and verified - sync cart to backend
          await syncCartToBackend(userData._id);
        } else {
          setIsAuthenticated(false);
          setUserId(null);
          setLoginOpen(true);
        }
      } catch (error) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
        setUserId(null);
        setLoginOpen(true);
      }
    } else {
      setIsAuthenticated(false);
      setUserId(null);
      setLoginOpen(true);
    }

    setIsCheckingAuth(false);
  };

  // Sync cart items to backend API
  const syncCartToBackend = async (userId: string) => {
    setIsProcessingCart(true);

    try {
      // Use filtered basket for sync to avoid syncing invalid items
      const cartItems = filteredBasket.map((item) => ({
        productId: item.id.toString(),
        quantity: item.qty,
        price: products.find((p) => p.id == item.id)?.price || 0,
      }));

      const cartData = {
        userId: userId,
        items: cartItems,
      };

      const result = await cartService.addItemsToCart(cartData);

      if (result.code === 200 || result.code === 201) {
        toast.success("🎉 Basket synced successfully! Ready for payment.");
        setReceiverModalOpen(true);
      } else {
        toast.error(
          result.message || "Failed to sync basket. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Cart sync error:", error);
      toast.error("Failed to sync your basket. Please try again.");
    } finally {
      setIsProcessingCart(false);
    }
  };

  const closeAllModals = () => {
    setLoginOpen(false);
    setReceiverModalOpen(false);
    // Show mobile basket again when modals are closed
    setShowMobileBasket(true);
  };

  const handleLoginSuccess = async () => {
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
          setIsAuthenticated(true);
          setUserId(profileResponse.data.data._id);
          setLoginOpen(false);
          await syncCartToBackend(profileResponse.data.data._id);
        }
      }
    } catch (error) {
      console.error("Error after login:", error);
      toast.error("Failed to sync your basket after login.");
    }
  };

  const handleSignupSuccess = (
    email: string,
    phone: string,
    newUserId?: string,
    token?: string
  ) => {
    // Close login dialog immediately
    setLoginOpen(false);

    // Set user data for verification
    setUserEmail(email);
    setUserPhone(phone);

    // If we have token and userId, auto-login the user
    if (token && newUserId) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", newUserId);
      setIsAuthenticated(true);
      setUserId(newUserId);
    }

    // Start verification flow
    setShowVerifyModal(true);
  };

  // Load user cart on authentication
  useEffect(() => {
    const loadUserCart = async () => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        try {
          const profileResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          if (
            profileResponse.status === 200 ||
            profileResponse.status === 201
          ) {
            setIsAuthenticated(true);
            setUserId(profileResponse.data.data._id);

            // Load user's cart from backend
            const cartResult = await cartService.getUserCart(
              profileResponse.data.data._id
            );

            if (
              cartResult.data?.items &&
              Array.isArray(cartResult.data.items)
            ) {
              // Convert API cart items to local basket format and filter invalid items
              const apiBasket: BasketItem[] = cartResult.data.items
                .map((item: any) => {
                  // Handle both cases: productId as object or string
                  const productId =
                    typeof item.productId === "object"
                      ? item.productId._id
                      : item.productId;

                  const productName =
                    typeof item.productId === "object"
                      ? item.productId.name
                      : "Unknown Product";

                  return {
                    id: productId,
                    qty: item.quantity,
                    name: productName,
                  };
                })
                .filter(
                  (item): item is BasketItem =>
                    item.id !== undefined &&
                    item.qty !== undefined &&
                    item.name !== undefined &&
                    item.qty >= 1 // Only keep items with quantity >= 1
                );

              setBasket(apiBasket);
            }
          }
        } catch (error) {
          console.error("Failed to load user cart:", error);
        }
      }
    };

    loadUserCart();
  }, [setBasket]);

  return (
    <>
      {/* DESKTOP VIEW - Hidden on mobile */}
      <div className="hidden lg:block border-0 rounded-2xl bg-background">
        <h3 className="font-normal pt-6 pb-2 w-full text-center">
          Gift basket
          {isAuthenticated && (
            <span className="pl-1 text-sm text-green-600">✓</span>
          )}
        </h3>
        <div className="min-h-[450px] p-4">
          {filteredBasket.length === 0 ? (
            <EmptyBasket />
          ) : (
            <div className="space-y-1 max-h-[420px] overflow-y-auto">
              <div className="flex justify-between px-1.5 text-xs items-center">
                <h5 className="text-sm">Your Items</h5>
                <Button
                  variant="ghost"
                  className="text-[#6A70FF] text-xs px-2 py-1 h-6 rounded-3xl"
                  onClick={clearBasket}
                  disabled={isClearingBasket}
                >
                  {isClearingBasket ? "Clearing..." : "Clear All"}
                </Button>
              </div>
              {filteredBasket.map((b) => (
                <BasketItemCard
                  key={b.id}
                  item={b}
                  products={products}
                  setBasket={setBasket}
                  isAuthenticated={isAuthenticated}
                  userId={userId || undefined}
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
                  filteredBasket.length === 0 ||
                  isCheckingAuth ||
                  isProcessingCart
                }
                className="disabled:opacity-50 rounded-3xl px-1.5 text-xs flex py-1 h-7 space-x-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-[#4145A7] hover:to-[#5a5fc7]"
                onClick={handleSendBasket}
              >
                <>
                  <Badge
                    className="rounded-full bg-[#4145A7] p-0.5 text-sm w-5 h-5 flex justify-center"
                    title={`${filteredBasket.length} items`}
                  >
                    {filteredBasket.length}
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

      {/* MOBILE VIEW - Fixed bottom bar with expandable sheet */}
      {showMobileBasket && (
        <div className="lg:hidden">
          {/* Fixed Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-[1.5px] border-transparent [border-image:linear-gradient(to_right,#00E19D_0%,#6A70FF_36%,#00BBD4_66%,#AEE219_100%)_1] shadow-lg">
            <div className="flex justify-between items-center px-4 py-3">
              {/* Left side - Basket info with tap to expand */}
              <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
                <SheetTrigger asChild>
                  <button className="flex flex-col items-start">
                    <h6 className="text-muted-foreground text-xs">
                      Your basket
                    </h6>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-base">
                        ₦ {getBasketTotal().toLocaleString()}
                      </span>
                      {filteredBasket.length > 0 && (
                        <Badge className="rounded-full bg-[#6A70FF] text-white text-xs h-5 px-2">
                          {filteredBasket.length}
                        </Badge>
                      )}
                    </div>
                  </button>
                </SheetTrigger>

                <SheetContent side="bottom" className="h-[80vh] p-0">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle className="flex items-center justify-between">
                      <span>
                        Gift basket
                        {isAuthenticated && (
                          <span className="pl-1 text-sm text-green-600">✓</span>
                        )}
                      </span>
                      {filteredBasket.length > 0 && (
                        <Button
                          variant="ghost"
                          className="text-[#6A70FF] text-xs px-2 py-1 h-7 rounded-3xl"
                          onClick={clearBasket}
                          disabled={isClearingBasket}
                        >
                          {isClearingBasket ? "Clearing..." : "Clear All"}
                        </Button>
                      )}
                    </SheetTitle>
                  </SheetHeader>

                  <div className="p-4 overflow-y-auto h-[calc(80vh-80px)]">
                    {filteredBasket.length === 0 ? (
                      <EmptyBasket />
                    ) : (
                      <div className="space-y-2">
                        {filteredBasket.map((b) => (
                          <BasketItemCard
                            key={b.id}
                            item={b}
                            products={products}
                            setBasket={setBasket}
                            isAuthenticated={isAuthenticated}
                            userId={userId || undefined}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Right side - Send basket button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="default"
                    disabled={
                      filteredBasket.length === 0 ||
                      isCheckingAuth ||
                      isProcessingCart
                    }
                    className="disabled:opacity-50 rounded-3xl px-3 text-xs flex py-2 h-9 space-x-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-[#4145A7] hover:to-[#5a5fc7]"
                    onClick={handleSendBasket}
                  >
                    <span className="font-medium">Send basket</span>
                    {isCheckingAuth || isProcessingCart ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Icon
                        icon="streamline-ultimate:shopping-basket-1"
                        className="text-white h-4 w-4"
                      />
                    )}
                  </Button>
                </AlertDialogTrigger>
              </AlertDialog>
            </div>
          </div>

          {/* Spacer to prevent content from being hidden behind fixed bar */}
          <div className="h-20"></div>
        </div>
      )}

      {/* Show LoginDialog only when user is NOT authenticated and loginOpen is true */}
      <LoginDialog
        open={
          loginOpen && !isAuthenticated && !showVerifyModal && !showPinModal
        }
        setOpen={setLoginOpen}
        basketTotal={getBasketTotal()}
        basketCount={filteredBasket.length} // Use filteredBasket here
        basket={filteredBasket} // Use filteredBasket here
        products={products}
        onLoginSuccess={handleLoginSuccess}
        onSignupSuccess={handleSignupSuccess}
      />

      {/* Show ReceiverInfoModal only when user IS authenticated and receiverModalOpen is true */}
      <ReceiverInfoModal
        open={receiverModalOpen && isAuthenticated}
        setOpen={setReceiverModalOpen}
        basketTotal={getBasketTotal()}
        basketCount={filteredBasket.length} // Use filteredBasket here
        receiverName={receiverName}
        basket={filteredBasket} // Use filteredBasket here
        products={products}
        onCloseAll={closeAllModals}
      />

      {/* Show VerifyAccountModal when user is authenticated but email not verified */}
      {userEmail && (
        <VerifyAccountModal
          open={showVerifyModal}
          onClose={() => setShowVerifyModal(false)}
          email={userEmail}
          phone={userPhone}
          onVerificationSuccess={() => {
            // After successful verification, show PIN modal
            setShowVerifyModal(false);
            setShowPinModal(true);
          }}
        />
      )}

      {/* Show SetPinModal after email verification */}
      {userEmail && (
        <SetPinModal
          open={showPinModal}
          onClose={() => setShowPinModal(false)}
          email={userEmail}
          onPinSetSuccess={async () => {
            // After PIN is set, proceed with cart sync
            setShowPinModal(false);
            if (userId) {
              await syncCartToBackend(userId);
            }
          }}
        />
      )}
    </>
  );
}
