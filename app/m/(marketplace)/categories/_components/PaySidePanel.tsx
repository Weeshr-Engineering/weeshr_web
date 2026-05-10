"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/service/product.service";
import { BasketItem } from "@/lib/BasketItem";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { getNoteSuggestions } from "./note-suggestions";

interface PaySidePanelProps {
  basket: BasketItem[];
  products: Product[];
  subTotal: number;
  deliveryFee: number;
  serviceCharge: number;
  totalPrice: number;
  basketCount?: number;
  receiverName?: string;
  onProceedToPay?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  isProcessing?: boolean;
}

export default function PaySidePanel({
  basket,
  products,
  subTotal,
  deliveryFee = 0,
  serviceCharge = 0,
  totalPrice,
  basketCount = 0,
  receiverName = "Receiver",
  onProceedToPay,
  isProcessing = false,
}: PaySidePanelProps) {
  const [imageLoadedStates, setImageLoadedStates] = useState<
    Record<string, boolean>
  >({});

  const [isExpanded, setIsExpanded] = useState(false);
  const [note, setNote] = useState("");
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const noteSuggestions = getNoteSuggestions(receiverName);

  const handleShuffleNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex = (suggestionIndex + 1) % noteSuggestions.length;
    setSuggestionIndex(nextIndex);
    setNote(noteSuggestions[nextIndex]);
  };

  // Add safe defaults for all number values
  const safeSubTotal = subTotal || 0;
  const safeDeliveryFee = deliveryFee || 0;
  const safeServiceCharge = serviceCharge || 0;
  const safeTotalPrice = totalPrice || 0;

  return (
    <div className="flex-1 relative">
      {/* Modern gradient background with subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 rounded-3xl" />

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-3xl animate-pulse-slow" />

      {/* Main content */}
      <Card className="h-full bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-200/30 to-transparent rounded-full translate-y-12 -translate-x-12" />

        <CardContent 
          className="h-full flex flex-col p-6 relative z-10"
          onClick={() => isExpanded && setIsExpanded(false)}
        >
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-1">
                What{" "}
                <span
                  className="bg-gradient-custom bg-clip-text text-transparent px-1"
                  style={{
                    fontFamily:
                      "var(--font-playwrite), 'Playwrite CU', cursive, sans-serif",
                  }}
                >
                  {receiverName}
                </span>{" "}
                is getting
              </h3>
              <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold text-gray-600 border border-gray-200">
                {basket.reduce((acc, item) => acc + item.qty, 0)}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Review your items before payment
            </p>
          </div>

          {/* Items List (Stacked or Expanded) */}
          <div 
            className={cn(
              "relative mb-8 transition-all duration-500",
              isExpanded ? "h-[210px] overflow-y-auto space-y-3 pr-2" : "h-[140px]"
            )}
            onClick={(e) => {
              if (!isExpanded && basket.length > 1) {
                e.stopPropagation();
                setIsExpanded(true);
              }
            }}
          >
            {basket?.length ? (
              isExpanded ? (
                // Expanded View
                basket.map((item) => {
                  const product = products.find((p) => p.id == item.id);
                  if (!product) return null;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm"
                    >
                      <div className="relative w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500">₦ {product.price.toLocaleString()}</p>
                      </div>
                      {item.qty > 1 && (
                        <Badge variant="secondary" className="rounded-full bg-gray-100 text-gray-600">x{item.qty}</Badge>
                      )}
                    </motion.div>
                  );
                })
              ) : (
                // Stacked View
                <div className="relative h-full pt-4 cursor-pointer">
                  {basket.slice(0, 3).map((item, index) => {
                    const product = products.find((p) => p.id == item.id);
                    if (!product) return null;

                    const scale = 1 - index * 0.05;
                    const translateY = index * 12;
                    const opacity = 1 - index * 0.1;

                    return (
                      <motion.div
                        key={item.id}
                        initial={false}
                        animate={{ 
                          opacity, 
                          scale, 
                          y: translateY, 
                          zIndex: 30 - index,
                          transformOrigin: "top center"
                        }}
                        className={cn(
                          "absolute left-0 right-0 rounded-2xl p-4 border transition-all duration-300",
                          index === 0 
                            ? "bg-white border-gray-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] ring-1 ring-black/5" 
                            : "bg-gray-50/80 border-gray-200 shadow-sm"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 truncate text-base">{product.name}</p>
                            <p className="text-sm font-medium text-gray-500">₦ {product.price.toLocaleString()}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  {basket.length > 1 && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-indigo-500 font-bold bg-indigo-50/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-indigo-100/50 whitespace-nowrap shadow-sm hover:bg-indigo-100 transition-colors">
                      Click to expand all {basket.length} items
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <Icon icon="mdi:cart-outline" className="text-gray-300 text-4xl mx-auto mb-2" />
                <p className="text-gray-500">Your basket is empty</p>
              </div>
            )}
          </div>

          {/* Price Breakdown Section */}
          <div className="space-y-3 mb-8">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold text-gray-900 border-b border-dotted border-gray-300">
                ₦ {safeSubTotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Delivery</span>
              <span className="font-semibold text-gray-900">
                ₦ {safeDeliveryFee.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Service Fee</span>
              <span className="font-semibold text-gray-900">
                ₦ {safeServiceCharge.toLocaleString()}
              </span>
            </div>
            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-[#4145A7]">
                ₦ {safeTotalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Note Section */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-gray-500">Send a note with this gift</Label>
              <div 
                onClick={handleShuffleNote}
                className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100 shadow-sm cursor-pointer hover:bg-indigo-100 transition-all hover:scale-110 active:scale-95 group/magic"
              >
                <Icon icon="solar:stars-bold" className="w-4 h-4 group-hover/magic:animate-pulse" />
              </div>
            </div>
            <div className="relative group">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={`I kinda love you gan ni but ${receiverName}, manage 😄`}
                className="w-full min-h-[100px] bg-white border border-gray-200 rounded-2xl p-4 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none shadow-sm"
              />
              <div className="absolute bottom-3 right-3 opacity-0 group-focus-within:opacity-100 transition-opacity">
                <Icon icon="material-symbols:edit-outline" className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Footer with Proceed to Pay button */}
          <div className="mt-auto pt-4 border-t-[1.5px] border-transparent [border-image:linear-gradient(to_right,#00E19D_0%,#6A70FF_36%,#00BBD4_66%,#AEE219_100%)_1] md:hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onProceedToPay?.(e);
              }}
              disabled={isProcessing || !basketCount}
              className="w-full bg-[#4145A7] text-white rounded-3xl py-4 px-4 font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Proceed to payment</span>
                  <Icon
                    icon="ph:credit-card-bold"
                    className="h-5 w-5"
                  />
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Add custom animation */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.1;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
