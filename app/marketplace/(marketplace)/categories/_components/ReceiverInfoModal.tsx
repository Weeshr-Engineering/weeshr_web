// @ts-nocheck
"use client";

import { useState } from "react";
import Image from "next/image";

import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

import { useGoogleMaps } from "@/lib/useGoogleMaps";

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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetOverlay,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";

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
  totalPrice: number;
  deliveryFee: number;
  serviceCharge: number;
  onCloseAll?: () => void;
}

interface FormData {
  countryCode: string;
  phoneNumber: string;
  address: string;
  deliveryDate: string;
  email: string; // still here, but optional
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
  totalPrice,
  deliveryFee,
  serviceCharge,
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
  const [usePhoneForDelivery, setUsePhoneForDelivery] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [hasInvalidAddressAttempt, setHasInvalidAddressAttempt] =
    useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const searchParams = useSearchParams();
  const nameFromUrl = searchParams?.get("name") || "";
  const rawReceiverName = nameFromUrl || receiverName;

  const formatName = (name: string) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };
  const finalReceiverName = formatName(rawReceiverName);

  // Address autocomplete hook

  const googleLoaded = useGoogleMaps();
  const {
    ready: addressReady,
    value: addressValue,
    suggestions: { status: addressStatus, data: addressData },
    setValue: setAddressValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "ng" },
      location: { lat: () => 6.5244, lng: () => 3.3792 }, // Lagos coordinates
      radius: 50000, // 50km radius around Lagos
    },
    debounce: 300,
    initOnMount: googleLoaded,
  });

  const handleAddressSelect = async (address: string) => {
    try {
      // Get geocode results to validate location
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);

      // Lagos bounds
      const lagosNorth = 6.7027;
      const lagosSouth = 6.3936;
      const lagosEast = 3.6945;
      const lagosWest = 3.0982;

      // Check if coordinates are within Lagos bounds
      const isInLagos =
        lat >= lagosSouth &&
        lat <= lagosNorth &&
        lng >= lagosWest &&
        lng <= lagosEast;

      if (!isInLagos) {
        toast.error("Please select an address within Lagos only");
        setHasInvalidAddressAttempt(true);
        clearSuggestions();
        return;
      }

      // Reset invalid attempt flag on valid selection
      setHasInvalidAddressAttempt(false);

      // Valid Lagos address
      setAddressValue(address, false);
      handleInputChange("address", address);
      setTimeout(() => {
        clearSuggestions();
      }, 100);
    } catch (error) {
      console.error("Error validating address:", error);
      toast.error("Failed to validate address. Please try again.");
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // EMAIL AND ADDRESS REMOVED FROM VALIDATION HERE
  const isFormValid = () =>
    formData.phoneNumber.trim() && formData.deliveryDate;

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

        // FALLBACK EMAIL STILL APPLIES
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
  const Content = (
    <div className="w-full flex flex-col md:flex-row-reverse gap-4 max-h-[85vh] md:max-h-none">
      {/* Grab handle for mobile */}
      {isMobile && (
        <div className="w-12 h-1 bg-black/20 rounded-full mx-auto mb-2 shrink-0" />
      )}

      {/* Product Image on Mobile */}
      {isMobile && basket?.length > 0 && (
        <div className="flex justify-center py-2 shrink-0">
          <div className="relative w-32 h-32">
            {products.find((p) => p.id == basket[0].id)?.image && (
              <Image
                src={products.find((p) => p.id == basket[0].id)!.image}
                alt="Product"
                fill
                className="object-cover rounded-2xl shadow-md"
              />
            )}
            <div className="absolute -top-2 -right-2 bg-[#4145A7] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium shadow-lg z-20">
              {basket.length}
            </div>
          </div>
        </div>
      )}

      {/* Left Form */}
      <Card className="flex-1 md:w-[55%] bg-white md:bg-white/95 backdrop-blur-sm shadow-2xl border-none rounded-3xl flex flex-col max-h-full overflow-hidden">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl font-normal text-primary text-left">
            More about
            <span
              className="relative whitespace-nowrap px-2 bg-gradient-custom bg-clip-text text-transparent text-xl lg:text-2xl capitalize"
              style={{
                fontFamily:
                  "var(--font-playwrite), 'Playwrite CU', cursive, sans-serif",
              }}
            >
              {finalReceiverName}
            </span>
            <div className="text-xs lg:text-sm text-muted-foreground mt-2">
              Fill in the details to send your gift
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 flex-1 overflow-y-auto">
          {/* Email (OPTIONAL NOW) */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Email Address (optional)
            </Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email address (optional)"
              className="rounded-xl h-12 border-2"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm text-muted-foreground">
                Phone Number
              </Label>
            </div>
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
                      <span className="text-xs">{formData.countryCode}</span>
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

          {/* Address or Phone Toggle */}
          <div className="space-y-2">
            {!usePhoneForDelivery ? (
              <>
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground">
                    Delivery Address
                  </Label>
                  <span className="text-[10px] text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1">
                    <Icon icon="mdi:map-marker" width="12" height="12" />
                    Lagos only
                  </span>
                </div>

                <div className="relative z-[9999]">
                  <Input
                    value={addressValue}
                    onChange={(e) => {
                      setAddressValue(e.target.value);
                      handleInputChange("address", e.target.value);
                    }}
                    placeholder={
                      addressReady
                        ? "Start typing address..."
                        : "Loading maps..."
                    }
                    className="rounded-xl h-12 border-2"
                  />

                  {/* Autocomplete Dropdown - only show when ready */}
                  {addressReady &&
                    addressStatus === "OK" &&
                    addressData.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto z-[9999]">
                        {addressData.map((suggestion) => {
                          const {
                            place_id,
                            structured_formatting: {
                              main_text,
                              secondary_text,
                            },
                          } = suggestion;

                          return (
                            <button
                              key={place_id}
                              onClick={() =>
                                handleAddressSelect(suggestion.description)
                              }
                              type="button"
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                            >
                              <div className="flex items-start gap-2">
                                <Icon
                                  icon="mdi:map-marker"
                                  className="text-green-600 mt-1 flex-shrink-0"
                                  width="16"
                                  height="16"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm text-gray-900">
                                    {main_text}
                                  </div>
                                  <div className="text-xs text-gray-500 truncate">
                                    {secondary_text}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                </div>

                <p
                  className={`text-xs flex items-center gap-1 transition-colors ${
                    hasInvalidAddressAttempt
                      ? "text-red-600 font-semibold"
                      : "text-amber-600"
                  }`}
                >
                  <Icon icon="mdi:information" width="14" height="14" />
                  <span>Delivery currently available in Lagos only.</span>
                </p>

                <p
                  className="text-xs text-[#6A70FF] cursor-pointer hover:underline mt-1"
                  onClick={() => setUsePhoneForDelivery(true)}
                >
                  <span className="text-muted-foreground mr-1">
                    Don't have the address?
                  </span>
                  Click here to send with phone number.
                </p>
              </>
            ) : (
              <>
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
                <p
                  className="text-xs text-[#6A70FF] cursor-pointer hover:underline mt-1"
                  onClick={() => setUsePhoneForDelivery(false)}
                >
                  <span className="text-muted-foreground mr-1">
                    I have the address?
                  </span>
                  Send with address
                </p>
              </>
            )}
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

        {/* Mobile View Order Details Button */}
        <div className="md:hidden border-t-[1.5px] border-transparent [border-image:linear-gradient(to_right,#00E19D_0%,#6A70FF_36%,#00BBD4_66%,#AEE219_100%)_1] flex justify-between items-center px-4 py-3">
          <div>
            <h6 className="text-muted-foreground text-xs">Your basket</h6>
            <span className="font-semibold">
              ₦ {totalPrice.toLocaleString()}
            </span>
          </div>
          <Button
            variant="default"
            disabled={!isFormValid()}
            className="disabled:opacity-50 rounded-3xl px-3 text-xs py-2 h-9 transition-all hover:bg-gradient-to-r hover:from-[#4145A7] hover:to-[#5a5fc7]"
            onClick={() => setShowOrderDetails(true)}
            type="button"
          >
            <span className="font-medium">View Order Details</span>
          </Button>
        </div>

        {/* Footer - Desktop only */}
        <div className="mt-auto border-t-[1.5px] border-transparent [border-image:linear-gradient(to_right,#00E19D_0%,#6A70FF_36%,#00BBD4_66%,#AEE219_100%)_1] md:flex justify-between items-center px-4 py-3 hidden">
          <div>
            <h6 className="text-muted-foreground text-xs">Your basket</h6>
            <span className="font-semibold">
              ₦ {totalPrice.toLocaleString()}{" "}
            </span>
          </div>
          <Button
            variant="default"
            disabled={!isFormValid() || isProcessing}
            className="disabled:opacity-50 rounded-3xl px-1.5 text-xs md:flex py-1 h-7 space-x-2 transition-all hover:bg-gradient-to-r hover:from-[#4145A7] hover:to-[#5a5fc7] hidden"
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
                <span className="font-medium hidden md:inline">
                  Proceed to Pay
                </span>
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Right: PaySidePanel - Desktop only */}
      <div className="w-[45%] hidden md:flex">
        <PaySidePanel
          basket={basket}
          products={products}
          subTotal={basketTotal} // Change this from basketTotal to subTotal prop
          deliveryFee={deliveryFee}
          serviceCharge={serviceCharge}
          totalPrice={totalPrice}
        />
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="bottom"
            className="rounded-t-[2.5rem] p-6 pb-8 border-none outline-none max-h-[95vh] overflow-y-auto"
          >
            {Content}
          </SheetContent>
        </Sheet>
      ) : (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent
            onCloseRequest={handleClose}
            className="border-none bg-transparent shadow-none flex items-center justify-center max-w-4xl w-[95%] md:mt-14 overflow-visible"
          >
            {Content}
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Mobile Order Details Sheet */}
      <Sheet open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <SheetContent
          side="bottom"
          className=" p-0 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]"
        >
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Order Details</SheetTitle>
          </SheetHeader>

          <div className="overflow-y-auto p-4">
            <PaySidePanel
              basket={basket}
              products={products}
              subTotal={basketTotal}
              deliveryFee={deliveryFee}
              serviceCharge={serviceCharge}
              totalPrice={totalPrice}
              basketCount={basketCount}
              onProceedToPay={handleMakePayment}
              isProcessing={isProcessing}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Payment Success Modal */}
      <PaymentSuccessModal
        open={showSuccessModal}
        setOpen={setShowSuccessModal}
        receiverName={finalReceiverName}
        address={formData.address}
        deliveryDate={formatDate(formData.deliveryDate)}
        onCloseAll={handleSuccessClose}
        phoneNumber={`${formData.countryCode} ${formData.phoneNumber}`}
      />
    </>
  );
}
