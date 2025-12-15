"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Icon } from "@iconify/react";
import axios from "axios";
import toast from "react-hot-toast";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasInvalidAddressAttempt, setHasInvalidAddressAttempt] =
    useState(false);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "ng" },
      locationBias: {
        north: 6.7027,
        south: 6.3936,
        east: 3.6945,
        west: 3.0982,
      },
      types: ["address"],
    },
    debounce: 300,
  });

  const handleSelect = async (address: string) => {
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
      setValue(address, false);
      clearSuggestions();
    } catch (error) {
      console.error("Error validating address:", error);
      toast.error("Failed to validate address. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!value.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/shipping-address`,
        {
          shippingAddress: value.trim(),
        }
      );

      if (response.data.code === 200 || response.data.code === 201) {
        onSubmit(true, "Details saved successfully");
        setValue("", false);
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
      <AlertDialogContent className="max-w-md bg-white rounded-3xl border-none shadow-2xl p-8 w-[97%] sm:w-full overflow-visible">
        <div className="space-y-6">
          {/* Title */}
          <h2 className="text-2xl font-semibold text-left">
            Enter Delivery Details
          </h2>

          {/* Address Input with Autocomplete */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm text-gray-600">Address</Label>
              <span className="text-[10px] text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1">
                <Icon icon="mdi:map-marker" width="12" height="12" />
                Lagos only
              </span>
            </div>

            <div className="relative z-[9999]">
              <Textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={
                  ready ? "Start typing Lagos address..." : "Loading maps..."
                }
                className="min-h-[120px] rounded-xl border-2 resize-none"
                disabled={isSubmitting}
              />

              {/* Autocomplete Dropdown - only show when ready */}
              {ready && status === "OK" && data.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto z-[9999]">
                  {data.map((suggestion) => {
                    const {
                      place_id,
                      structured_formatting: { main_text, secondary_text },
                    } = suggestion;

                    return (
                      <button
                        key={place_id}
                        onClick={() => handleSelect(suggestion.description)}
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
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !value.trim()}
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
