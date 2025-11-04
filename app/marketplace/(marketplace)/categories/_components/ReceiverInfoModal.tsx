"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import LoginSidePanel from "./LoginSidePanel";

interface ReceiverInfoModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  basketTotal: number;
  basketCount: number;
  receiverName?: string;
}

// Country codes for phone input
const countryCodes = [
  { code: "+234", flag: "🇳🇬", country: "Nigeria" },
  { code: "+233", flag: "🇬🇭", country: "Ghana" },
  { code: "+254", flag: "🇰🇪", country: "Kenya" },
  { code: "+27", flag: "🇿🇦", country: "South Africa" },
  { code: "+1", flag: "🇺🇸", country: "USA" },
  { code: "+44", flag: "🇬🇧", country: "UK" },
  { code: "+33", flag: "🇫🇷", country: "France" },
  { code: "+49", flag: "🇩🇪", country: "Germany" },
];

export default function ReceiverInfoModal({
  open,
  setOpen,
  basketTotal,
  basketCount,
  receiverName = "Receiver",
}: ReceiverInfoModalProps) {
  const [formData, setFormData] = useState({
    countryCode: "+234",
    phoneNumber: "",
    address: "",
    deliveryDate: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMakePayment = () => {
    console.log("Making payment with receiver data:", {
      receiverInfo: formData,
      basketTotal,
      basketCount,
    });
    setOpen(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Select a date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const isFormValid = () => {
    return (
      formData.phoneNumber.trim() !== "" &&
      formData.address.trim() !== "" &&
      formData.deliveryDate !== ""
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent
        onCloseRequest={() => setOpen(false)}
        className="border-none bg-transparent shadow-none flex items-center justify-center max-w-4xl w-[95%]  md:mt-14"
      >
        <div className="w-full flex flex-col md:flex-row gap-4">
          {/* Left Side - Receiver Information Form */}
          <Card className="flex-1 bg-white/95 backdrop-blur-sm shadow-2xl border-none rounded-3xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-normal text-primary text-left">
                <span className="relative text-primary">
                  More about
                  <span
                    className="relative whitespace-nowrap px-2 bg-gradient-custom bg-clip-text text-transparent text-xl lg:text-2xl"
                    style={{ fontFamily: "Playwrite CU, sans-serif" }}
                  >
                    Dorcas
                  </span>
                </span>
                <div className="text-xs lg:text-sm text-muted-foreground mt-2">
                  Fill in the details to send your gift
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Phone Number */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Phone Number
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.countryCode}
                    onValueChange={(value) =>
                      handleInputChange("countryCode", value)
                    }
                  >
                    <SelectTrigger className="w-24 rounded-xl h-12 border-2 transition-colors">
                      <SelectValue>
                        <span className="flex items-center gap-1">
                          <span>
                            {
                              countryCodes.find(
                                (country) =>
                                  country.code === formData.countryCode
                              )?.flag
                            }
                          </span>
                          <span className="text-xs">
                            {
                              countryCodes.find(
                                (country) =>
                                  country.code === formData.countryCode
                              )?.code
                            }
                          </span>
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodes.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <span className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span>{country.code}</span>
                            <span className="text-xs text-gray-500">
                              {country.country}
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    placeholder="Enter phone number"
                    className="flex-1 rounded-xl h-12 border-2 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Delivery Address
                </Label>
                <div className="space-y-3">
                  <Input
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Enter full delivery address"
                    className="rounded-xl h-12 border-2 transition-colors"
                    required
                  />
                </div>
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
                  className="rounded-xl h-12 border-2 transition-colors"
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {formatDate(formData.deliveryDate)}
                </div>
              </div>
            </CardContent>

            {/* Bottom section with basket total and Make Payment button */}
            <div className="border-t-[1.5px] border-transparent [border-image:linear-gradient(to_right,#00E19D_0%,#6A70FF_36%,#00BBD4_66%,#AEE219_100%)_1] flex flex-row justify-between items-center px-4 py-3">
              <div>
                <h6 className="text-muted-foreground text-xs">Your basket</h6>
                <span className="font-semibold">
                  ₦ {(basketTotal ?? 0).toLocaleString()}
                </span>
              </div>

              <Button
                variant={"default"}
                disabled={!isFormValid()}
                className="disabled:opacity-50 rounded-3xl px-1.5 text-xs flex py-1 h-7 space-x-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-[#4145A7] hover:to-[#5a5fc7] focus:ring-2 focus:ring-[#4145A7] focus:ring-offset-2"
                onClick={handleMakePayment}
              >
                <Badge
                  className="rounded-full bg-[#4145A7] p-0.5 text-sm w-5 h-5 flex justify-center transition-transform duration-200 hover:scale-110"
                  title={`${basketCount} items in basket`}
                >
                  {basketCount}
                </Badge>
                <span className="font-medium">Make Payment</span>
                <Icon
                  icon="streamline-ultimate:shopping-basket-1"
                  className="text-white font-bold h-4 w-4"
                />
              </Button>
            </div>
          </Card>

          {/* Right Side - LoginSidePanel */}
          <LoginSidePanel isLogin={false} />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
