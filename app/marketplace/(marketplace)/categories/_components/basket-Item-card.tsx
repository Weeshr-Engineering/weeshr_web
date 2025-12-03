"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/service/product.service";
import { BasketItem } from "@/lib/BasketItem";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { cartService } from "@/service/cart.service";

interface BasketItemCardProps {
  item: BasketItem;
  products: Product[];
  setBasket: React.Dispatch<React.SetStateAction<BasketItem[]>>;
  isAuthenticated: boolean;
  userId?: string;
}

export function BasketItemCard({
  item,
  products,
  setBasket,
  isAuthenticated,
  userId,
}: BasketItemCardProps) {
  const product = products.find((p) => p.id == item.id);

  const [isUpdating, setIsUpdating] = useState(false);

  // Store a ref to debounce timer to avoid recreating it on each render
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  // Track accumulated clicks during debounce period
  const clickCountRef = useRef<number>(0);

  // Use product name from products array or fallback to item name
  const productName = product?.name || item.name || "Unknown Product";
  const productPrice = product?.price || 0;
  const productImage = product?.image || "/api/placeholder/60/60";

  // Don't render if product has invalid price or quantity
  if (!product && !item.name) return null;
  if (item.qty < 1 || productPrice <= 0) return null;

  // Debounced API sync
  const syncQuantity = (newQty: number) => {
    if (!isAuthenticated || !userId) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setIsUpdating(true);
      const clicksToSend = clickCountRef.current;
      clickCountRef.current = 0; // Reset click count after sending

      try {
        if (newQty === 0) {
          const result = await cartService.removeItemFromCart(
            userId,
            item.id.toString()
          );
          if (!(result.code === 200 || result.code === 201)) {
            toast.error("Failed to sync removal with server");
          }
        } else {
          const result = await cartService.addItemsToCart({
            userId,
            items: [
              {
                productId: item.id.toString(),
                quantity: clicksToSend, // Send accumulated clicks
                price: productPrice,
              },
            ],
          });
          if (!(result.code === 200 || result.code === 201)) {
            toast.error("Failed to sync quantity with server");
          }
        }
      } catch (err) {
        toast.error("Failed to sync quantity with server");
      } finally {
        setIsUpdating(false);
      }
    }, 600); // Wait 600ms after last click
  };

  // Handle increment
  const increment = () => {
    const newQty = item.qty + 1;

    // Update UI immediately
    setBasket((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, qty: newQty } : i))
    );

    // Accumulate clicks
    clickCountRef.current += 1;
    syncQuantity(newQty);
  };

  // Handle decrement
  const decrement = () => {
    const newQty = item.qty - 1;

    if (newQty <= 0) {
      // Remove from UI immediately
      setBasket((prev) => prev.filter((i) => i.id !== item.id));
      clickCountRef.current = -1; // Track removal
      syncQuantity(newQty);
    } else {
      setBasket((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, qty: newQty } : i))
      );
      // Accumulate clicks (negative for decrement)
      clickCountRef.current -= 1;
      syncQuantity(newQty);
    }
  };

  return (
    <div className="flex items-center justify-between bg-white border rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-1.5 gap-2 min-w-[300px]">
      {/* Image */}
      <div className="relative w-[60px] h-[60px] flex-shrink-0">
        <Image
          src={productImage}
          alt={productName}
          fill
          className="object-cover rounded-lg"
          sizes="100px"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `/api/placeholder/60/60?text=${encodeURIComponent(
              productName
            )}`;
          }}
        />
        {isUpdating && (
          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Name + Price */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="text-xs font-normal truncate">{productName}</div>
        <div className="text-xs text-muted-foreground">
          ₦ {productPrice.toLocaleString()}
        </div>
        {isAuthenticated && (
          <div className="text-xs text-green-600">✓ Synced</div>
        )}
      </div>

      {/* Counter */}
      <div className="flex items-end h-full pt-7">
        <div className="flex items-center rounded-full bg-[#F8F9FF] px-2 py-1 space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={decrement}
            className="rounded-full h-6 w-6 p-0 text-primary hover:bg-primary/10 hover:scale-110 transition-all duration-150"
          >
            -
          </Button>

          <span className="text-xs p-1 bg-white rounded-full text-primary h-6 w-6 flex items-center justify-center font-light">
            {item.qty}
          </span>

          <Button
            size="sm"
            variant="ghost"
            onClick={increment}
            className="rounded-full h-6 w-6 p-0 text-primary hover:bg-primary/10 hover:scale-110 transition-all duration-150"
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
}
