"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/service/product.service";
import { BasketItem } from "@/lib/BasketItem";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";

interface PaySidePanelProps {
  basket: BasketItem[];
  products: Product[];
  basketTotal: number;
  basketCount: number;
}

export default function PaySidePanel({
  basket,
  products,
  basketTotal,
  basketCount,
}: PaySidePanelProps) {
  const handleItemClick = (id: string | number) => {
    console.log("Clicked item:", id);
    // Optionally: open modal, navigate to product detail, etc.
  };

  return (
    <div className="hidden md:block flex-1 relative">
      {/* Modern gradient background with subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 rounded-3xl" />

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-3xl animate-pulse-slow" />

      {/* Main content */}
      <Card className="h-full bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-200/30 to-transparent rounded-full translate-y-12 -translate-x-12" />

        <CardContent className="h-full flex flex-col p-6 relative z-10">
          {/* Header with enhanced logo and status */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-gradient-to-r from-[#4145A7] to-[#5a5fc7] rounded-xl flex items-center justify-center">
                <Icon
                  icon="streamline-ultimate:shopping-basket-1"
                  className="text-white text-lg"
                />
              </div>
              <div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Icon
                    icon="mdi:shield-check"
                    className="text-sm text-green-400"
                  />
                  <span className="text-xs">Secure</span>
                </div>
              </div>
            </div>

            {/* ✅ Replaced Logo */}
            <Image
              alt="Weeshr"
              src="https://res.cloudinary.com/drykej1am/image/upload/v1704590604/j7aiv2jdwuksre2bpclu.png"
              width={100}
              height={34}
              className="opacity-90"
            />
          </div>

          {/* Order summary header */}
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Order Summary
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Review your items before payment
            </p>
          </div>

          {/* ✅ Scrollable & Clickable items list */}
          <div className="flex-1  space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 overflow-visible">
            {basket?.length ? (
              basket.map((item) => {
                const product = products.find((p) => p.id == item.id);
                if (!product) return null;

                const itemTotal = product.price * item.qty;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className="overflow-visible cursor-pointer flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-2xl p-1.5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] group active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-4 flex-1 overflow-visible">
                      <div className="relative overflow-visible">
                        <div className="relative w-12 h-12 overflow-visible">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover rounded-xl group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>

                        <div className="absolute -top-2 -right-2 bg-[#4145A7] z-[999] text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-medium shadow-lg">
                          {item.qty}
                        </div>
                      </div>

                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ₦ {product.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">
                        ₦ {itemTotal.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {item.qty} × ₦ {product.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon
                    icon="mdi:cart-outline"
                    className="text-gray-400 text-2xl"
                  />
                </div>
                <p className="text-gray-500 text-sm">Your basket is empty</p>
                <p className="text-gray-400 text-xs mt-1">
                  Add items to see them here
                </p>
              </div>
            )}
          </div>

          {/* Enhanced total section */}
          <div className="mt-4">
            {/* Compact cost breakdown */}
            <div className="bg-white/50 rounded-xl p-3 border border-gray-100">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    ₦ {basketTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Service fee</span>
                  <span className="text-gray-900">₦ 0</span>
                </div>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#4145A7]">
                    ₦ {basketTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
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
