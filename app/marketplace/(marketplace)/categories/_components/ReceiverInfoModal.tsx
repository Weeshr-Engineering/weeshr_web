// @ts-nocheck
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import PaySidePanel from "./PaySidePanel";
import PaymentSuccessModal from "../[vendor]/[product]/_components/PaymentSuccessModal";

import { BasketItem } from "@/lib/BasketItem";
import { Product } from "@/service/product.service";
import { cartService } from "@/service/cart.service";
import { checkoutService } from "@/service/checkout.service";

interface ReceiverInfoModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  basketTotal: number;
  basketCount: number;
  receiverName?: string;
  basket: BasketItem[];
  products: Product[];
  onCloseAll?: () => void;
}

interface FormData {
  countryCode: string;
  phoneNumber: string;
  address: string;
  deliveryDate: string;
  email: string;
}

const countryCodes = [
  { code: "+234", flag: "NG", country: "Nigeria" },
  { code: "+233", flag: "GH", country: "Ghana" },
  { code: "+254", flag: "KE", country: "Kenya" },
  { code: "+27", flag: "ZA", country: "South Africa" },
  { code: "+1", flag: "US", country: "USA" },
  { code: "+44", flag: "GB", country: "UK" },
  { code: "+33", flag: "FR", country: "France" },
  { code: "+49", flag: "DE", country: "Germany" },
];

export default function ReceiverInfoModal({
  open,
  setOpen,
  basketTotal,
  basketCount,
  receiverName = "Receiver",
  basket,
  products,
  onCloseAll,
}: ReceiverInfoModalProps) {
  const [formData, setFormData] = useState<FormData>({
    countryCode: "+234",
    phoneNumber: "",
    address: "",
    deliveryDate: "",
    email: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const searchParams = useSearchParams();
  const nameFromUrl = searchParams?.get("name") || "";
  const finalReceiverName = nameFromUrl || receiverName;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () =>
    formData.phoneNumber.trim() &&
    formData.address.trim() &&
    formData.deliveryDate &&
    formData.email.trim();

  const handleMakePayment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);

    try {
      const cartId = cartService.getCurrentCartId();
      if (!cartId) {
        toast.error("No active cart found. Please add items to your basket.");
        setIsProcessing(false);
        return;
      }

      const checkoutData = {
        cartId,
        receiverName: finalReceiverName,
        email:
          formData.email ||
          `${finalReceiverName.toLowerCase().replace(/\s+/g, "")}@example.com`,
        phoneNumber: formData.phoneNumber, 
        countryCode: formData.countryCode,
        shippingAddress: formData.address,
        deliveryDate: formData.deliveryDate,
        frequency: "once" as const,
        currency: "NGN" as const,
      };

      const result = await checkoutService.processCheckout(checkoutData);

      if (result.code === 200 || result.code === 201) {
        const authorizationUrl = result.data?.authorization_url;
        if (authorizationUrl) {
          toast.success("Redirecting to payment page...");
          window.open(authorizationUrl, "_self");

          const reference = result.data.reference;
          if (reference) {
            localStorage.setItem("paymentReference", reference);
          }

          setOpen(false);
          onCloseAll?.();
        } else {
          toast.error("Payment URL not received. Please try again.");
        }
      } else {
        toast.error(result.message || "Checkout failed. Please try again.");
      }
    } catch (error: unknown) {
      console.error("Checkout error:", error);
      toast.error("Failed to process checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    onCloseAll?.();
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setOpen(false);
    onCloseAll?.();
  };

  const formatDate = (dateString: string) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Select a date";

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent
          onCloseRequest={handleClose}
          className="border-none bg-transparent shadow-none flex items-center justify-center max-w-4xl w-[95%] md:mt-14 max-h-[550px]"
        >
          <div className="w-full flex flex-col md:flex-row-reverse gap-4">
            {/* Left Form */}
            <Card className="flex-1 md:w-[55%] bg-white/95 backdrop-blur-sm shadow-2xl border-none rounded-3xl flex flex-col">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-normal text-primary text-left">
                  More about
                  <span
                    className="relative whitespace-nowrap px-2 bg-gradient-custom bg-clip-text text-transparent text-xl lg:text-2xl"
                    style={{ fontFamily: "Playwrite CU, sans-serif" }}
                  >
                    {finalReceiverName}
                  </span>
                  <div className="text-xs lg:text-sm text-muted-foreground mt-2">
                    Fill in the details to send your gift
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 flex-1 overflow-y-auto">
                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                    className="rounded-xl h-12 border-2"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Phone Number
                  </Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.countryCode}
                      onValueChange={(v) => handleInputChange("countryCode", v)}
                    >
                      <SelectTrigger className="w-24 rounded-xl h-12 border-2">
                        <SelectValue>
                          <span className="flex items-center gap-1">
                            <span>
                              {
                                countryCodes.find(
                                  (c) => c.code === formData.countryCode
                                )?.flag
                              }
                            </span>
                            <span className="text-xs">
                              {formData.countryCode}
                            </span>
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            <span className="flex items-center gap-2">
                              <span>{c.flag}</span>
                              <span>{c.code}</span>
                              <span className="text-xs text-gray-500">
                                {c.country}
                              </span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      placeholder="Enter phone number"
                      className="flex-1 rounded-xl h-12 border-2"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Delivery Address
                  </Label>
                  <Input
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Enter full delivery address"
                    className="rounded-xl h-12 border-2"
                    required
                  />
                </div>

                {/* Delivery Date */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Delivery Date
                  </Label>
                  <Input
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) =>
                      handleInputChange("deliveryDate", e.target.value)
                    }
                    className="rounded-xl h-12 border-2"
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(formData.deliveryDate)}
                  </div>
                </div>
              </CardContent>

              {/* Footer */}
              <div className="mt-auto border-t-[1.5px] border-transparent [border-image:linear-gradient(to_right,#00E19D_0%,#6A70FF_36%,#00BBD4_66%,#AEE219_100%)_1] flex justify-between items-center px-4 py-3">
                <div>
                  <h6 className="text-muted-foreground text-xs">Your basket</h6>
                  <span className="font-semibold">
                    ₦ {basketTotal.toLocaleString()}
                  </span>
                </div>
                <Button
                  variant="default"
                  disabled={!isFormValid() || isProcessing}
                  className="disabled:opacity-50 rounded-3xl px-1.5 text-xs flex py-1 h-7 space-x-2 transition-all hover:bg-gradient-to-r hover:from-[#4145A7] hover:to-[#5a5fc7]"
                  onClick={handleMakePayment}
                  type="button"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span className="font-medium">Processing...</span>
                    </>
                  ) : (
                    <>
                      <Badge className="rounded-full bg-[#4145A7] p-0.5 text-sm w-5 h-5 flex justify-center">
                        {basketCount}
                      </Badge>
                      <span className="font-medium">Proceed to Pay</span>
                      <Icon
                        icon="streamline-ultimate:shopping-basket-1"
                        className="h-4 w-4"
                      />
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Right: PaySidePanel */}
            <div className="w-[45%] flex">
              <PaySidePanel
                basketTotal={basketTotal}
                basketCount={basketCount}
                basket={basket}
                products={products}
              />
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Payment Success Modal */}
      <PaymentSuccessModal
        open={showSuccessModal}
        setOpen={setShowSuccessModal}
        receiverName={finalReceiverName}
        address={formData.address}
        deliveryDate={formatDate(formData.deliveryDate)}
        onCloseAll={handleSuccessClose}
      />
    </>
  );
}
