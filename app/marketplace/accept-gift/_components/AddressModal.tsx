"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import axios from "axios";
import toast from "react-hot-toast";

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  onSubmit: (success: boolean, message: string) => void;
}

export default function AddressModal({
  open,
  onClose,
  orderId,
  onSubmit,
}: AddressModalProps) {
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!address.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/shipping-address`,
        {
          shippingAddress: address.trim(),
        }
      );

      if (response.data.code === 200 || response.data.code === 201) {
        onSubmit(true, "Details saved successfully");
        setAddress("");
      } else {
        onSubmit(false, response.data.message || "Failed to save address");
      }
    } catch (error: any) {
      console.error("Address submission error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to save address. Please try again.";
      onSubmit(false, errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md bg-white rounded-3xl border-none shadow-2xl p-8 w-[97%] sm:w-full">
        <div className="space-y-6">
          {/* Title */}
          <h2 className="text-2xl font-semibold text-left">
            Enter Delivery Details
          </h2>

          {/* Address Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm text-gray-600">Address</Label>
              <span className="text-xs text-[#00E19D] font-medium">
                Map Enabled
              </span>
            </div>
            <Textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="No. 3, Olulana, Gulfer Estate, Lagos State"
              className="min-h-[120px] rounded-xl border-2 resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !address.trim()}
            className="w-full h-14 rounded-full bg-[#4145A7] hover:bg-[#4145A7]/90 text-white font-medium text-lg disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span>Saving...</span>
              </div>
            ) : (
              "Save details"
            )}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
