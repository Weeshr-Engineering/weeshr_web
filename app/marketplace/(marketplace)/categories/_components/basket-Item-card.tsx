"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/service/product.service";
import { BasketItem } from "@/lib/BasketItem";

interface BasketItemCardProps {
  item: BasketItem;
  products: Product[];
  setBasket: React.Dispatch<React.SetStateAction<BasketItem[]>>;
}

export function BasketItemCard({
  item,
  products,
  setBasket,
}: BasketItemCardProps) {
  const product = products.find((p) => p.id == item.id);

  if (!product) return null;

  // Handle increment
  const increment = () => {
    setBasket((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
    );
  };

  // Handle decrement (remove if qty would hit 0)
  const decrement = () => {
    setBasket((prev) =>
      prev
        .map((i) => (i.id === item.id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  };

  return (
    <div className="flex items-center justify-between bg-white border rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-1.5 gap-2 min-w-[300px]">
      {/* Image */}
      <div className="relative w-[60px] h-[60px] flex-shrink-0">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover rounded-lg"
          sizes="100px"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `/api/placeholder/60/60?text=${encodeURIComponent(
              product.name
            )}`;
          }}
        />
      </div>

      {/* Name + Price */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="text-xs font-normal truncate">{product.name}</div>
        <div className="text-xs text-muted-foreground">
          ₦ {product.price.toLocaleString()}
        </div>
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
