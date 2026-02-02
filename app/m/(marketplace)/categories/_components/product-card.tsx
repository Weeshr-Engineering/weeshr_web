"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Product } from "@/service/product.service";
import { BasketItem } from "@/lib/BasketItem";
import { cn } from "@/lib/utils";
import { ImageSlider } from "./image-slider";

interface ProductCardProps {
  product: Product;
  basket: BasketItem[];
  onExpand: (product: Product, index?: number) => void;
  onAdd: (id: string) => void;
  hoverId: string | null;
  setHoverId: (id: string | null) => void;
}

export function ProductCard({
  product,
  basket,
  onExpand,
  onAdd,
  hoverId,
  setHoverId,
}: ProductCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const basketItem = basket.find((item) => item.id === product.id);
  const itemCount = basketItem?.qty || 0;
  const isHovered = hoverId === product.id;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={product.isAvailable ? { y: -6 } : {}}
      whileTap={product.isAvailable ? { scale: 0.97 } : {}}
      className="w-full group"
    >
      <Card
        onMouseEnter={() => setHoverId(product.id)}
        onMouseLeave={() => setHoverId(null)}
        className={cn(
          "overflow-hidden rounded-3xl transition-all duration-500 ease-out relative aspect-[3/4] flex flex-col",
          "bg-gradient-to-br from-white/95 via-white/90 to-white/95",
          "backdrop-blur-xl border-[1.5px]",
          product.isAvailable
            ? "cursor-pointer border-gray-200/60 hover:border-marketplace-primary/60 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_40px_-8px_rgba(147,51,234,0.15),0_0_0_1px_rgba(147,51,234,0.05)]"
            : "opacity-50 cursor-not-allowed border-gray-200/40 shadow-sm",
        )}
      >
        {/* Image / Slider Container */}
        <div className="absolute inset-0 cursor-zoom-in group/image bg-gray-100 overflow-hidden">
          <ImageSlider
            images={images}
            alt={product.name}
            autoplayDelay={3500 + Math.random() * 1000} // Randomize slightly so they don't all flip at once
            onImageClick={(index) => onExpand(product, index)}
            showArrows={false} // We handle arrows in slider or want a cleaner look
            className="h-full w-full"
            imageClassName={cn(
              "transition-transform duration-700 ease-out",
              isHovered && "scale-110",
            )}
          />

          {/* Item Count Badge */}
          {itemCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                opacity: isHovered ? 0 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="absolute top-4 right-2 z-30 bg-marketplace-primary text-gray-900 rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white"
            >
              <span className="text-xs font-bold">{itemCount}</span>
            </motion.div>
          )}

          {/* Elegant zoom indicator - top right */}
          <motion.div
            className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-full p-2 shadow-lg z-20 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.8,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Icon
              icon="ph:magnifying-glass-plus"
              className="w-4 h-4 text-white"
            />
          </motion.div>

          {/* Dark gradient overlay on hover for text readability */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Price Tag - Always visible at top left */}
        <motion.div
          className="absolute top-3 left-3 z-30 bg-white backdrop-blur-md rounded-full px-3 py-1.5 shadow-md border border-white/60 pointer-events-none"
          animate={{
            scale: isHovered ? 1.05 : 1,
            opacity: isHovered ? 1 : 0.85,
          }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-semibold text-[13px] md:text-[14px] bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent">
            ₦{product.price.toLocaleString()}
          </p>
        </motion.div>

        {/* Instagram-style overlay - slides up on hover */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-30 p-3 md:p-4 pointer-events-none"
          initial={{ y: "100%", opacity: 0 }}
          animate={{
            y: isHovered ? 0 : "100%",
            opacity: isHovered ? 1 : 0,
          }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          <div className="space-y-2.5">
            {/* Product Info */}
            <div className="space-y-1">
              <h3 className="text-white text-[13px] md:text-[14px] font-semibold tracking-tight leading-tight drop-shadow-lg line-clamp-1">
                {product.name}
              </h3>
              <p className="text-white/85 text-[11px] md:text-[12px] leading-snug drop-shadow-md line-clamp-2">
                {product.description}
              </p>
            </div>

            {/* Add to Basket Button */}
            <Button
              size="sm"
              variant="marketplace"
              onClick={(e) => {
                e.stopPropagation();
                onAdd(product.id);
              }}
              className={cn(
                "w-full rounded-full font-semibold text-[13px] md:text-[14px] gap-2 flex items-center justify-center h-10 md:h-11 transition-all duration-300 pointer-events-auto",
                "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_30px_-6px_rgba(147,51,234,0.4)]",
                "hover:bg-marketplace-primary/80",
                "border-2 border-marketplace-primary/60 hover:border-marketplace-primary",
                !product.isAvailable && "opacity-50",
              )}
              disabled={!product.isAvailable}
            >
              {product.isAvailable ? (
                <>
                  <Icon
                    icon="streamline-ultimate:shopping-basket-1"
                    className="text-gray-900 h-5 w-5"
                  />
                  <span className="text-gray-900 font-semibold">
                    Add to basket
                  </span>
                </>
              ) : (
                <span className="text-gray-600">Out of stock</span>
              )}
            </Button>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
}
