"use client";

import Image from "next/image";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Product, ProductService } from "@/service/product.service";
import { cartService } from "@/service/cart.service";
import toast from "react-hot-toast";
import { BasketItem } from "@/lib/BasketItem";
import { cn } from "@/lib/utils";

interface MenuListProps {
  vendorId: string;
  addToBasket: (id: string) => void;
  basket: BasketItem[];
  products: Product[];
  isAuthenticated: boolean;
  userId?: string;
}

export function MenuList({
  vendorId,
  addToBasket,
  basket,
  products,
  isAuthenticated,
  userId,
}: MenuListProps) {
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [menuProducts, setMenuProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedImage, setExpandedImage] = useState<Product | null>(null);
  const [imageScale, setImageScale] = useState(1);
  const [dragY, setDragY] = useState(0);

  // Track image loading state for each product
  const [imageLoadedStates, setImageLoadedStates] = useState<
    Record<string, boolean>
  >({});

  // Use a single debounce ref per product for better consistency
  const debounceRefs = useRef<{ [key: string]: NodeJS.Timeout | null }>({});
  // Track accumulated clicks for each product
  const clickCountRefs = useRef<{ [key: string]: number }>({});

  // Fetch products when vendorId changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await ProductService.getProductsByVendor(vendorId);
        setMenuProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setMenuProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) fetchProducts();
  }, [vendorId]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && expandedImage) {
        setExpandedImage(null);
        setImageScale(1);
        setDragY(0);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [expandedImage]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (expandedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [expandedImage]);

  // Sync function - similar to BasketItemCard
  const syncAddToCart = (productId: string) => {
    if (!isAuthenticated || !userId) return;

    // Clear existing debounce timer
    if (debounceRefs.current[productId]) {
      clearTimeout(debounceRefs.current[productId]!);
    }

    // Get the product details
    const product = menuProducts.find((p) => p.id === productId);
    if (!product) return;

    // Accumulate clicks (in this case, always +1 for add button)
    clickCountRefs.current[productId] =
      (clickCountRefs.current[productId] || 0) + 1;
    const clicksToSend = clickCountRefs.current[productId];

    debounceRefs.current[productId] = setTimeout(async () => {
      try {
        // Send only the incremental change, not the entire basket
        const result = await cartService.addItemsToCart({
          userId,
          items: [
            {
              productId: productId.toString(),
              quantity: clicksToSend, // Send accumulated clicks
              price: product.price || 0,
            },
          ],
        });

        if (!(result.code === 200 || result.code === 201)) {
          // toast.error("Failed to sync with server");
        } else {
          // Reset click count after successful sync
          clickCountRefs.current[productId] = 0;
        }
      } catch (error) {
        // toast.error("Failed to sync with server");
        console.error("Sync error:", error);
      }
    }, 600); // 600ms debounce (same as BasketItemCard)
  };

  const handleAdd = (productId: string) => {
    // Update UI immediately
    addToBasket(productId);

    // Shake animation
    setShakeId(productId);
    setTimeout(() => setShakeId(null), 500);

    // Sync with API (debounced)
    syncAddToCart(productId);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 py-6 pt-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card
            key={index}
            className="overflow-hidden rounded-3xl bg-gradient-to-br from-white/95 via-white/90 to-white/95 backdrop-blur-xl border-[1.5px] border-gray-200/60 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] aspect-[3/4] relative animate-pulse"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50"></div>
            <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-100 to-amber-50 rounded-full h-8 w-20 border border-amber-200/40"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (menuProducts.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No products found for this vendor.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 py-6 pt-4">
      {menuProducts.map((product) => {
        const basketItem = basket.find((item) => item.id === product.id);
        const itemCount = basketItem?.qty || 0;
        const isHovered = hoverId === product.id;

        return (
          <motion.div
            key={product.id}
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
              {/* Image Container - Full card */}
              <div
                className="absolute inset-0 cursor-zoom-in group/image bg-gradient-to-br from-gray-50 to-gray-100/50 overflow-hidden"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedImage(product);
                }}
              >
                {/* Shimmer skeleton while loading */}
                {!imageLoadedStates[product.id] && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-amber-50/30 to-gray-50 animate-shimmer z-10" />
                )}

                <motion.div
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{
                    opacity: imageLoadedStates[product.id] ? 1 : 0,
                    scale: imageLoadedStates[product.id] ? 1 : 1.02,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="w-full h-full"
                >
                  <motion.div
                    animate={{
                      scale: isHovered ? 1.1 : 1,
                    }}
                    transition={{
                      duration: 0.7,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="w-full h-full"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      loading="lazy"
                      quality={85}
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      onLoad={() => {
                        setImageLoadedStates((prev) => ({
                          ...prev,
                          [product.id]: true,
                        }));
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `/api/placeholder/400/500?text=${encodeURIComponent(
                          product.name,
                        )}`;
                        setImageLoadedStates((prev) => ({
                          ...prev,
                          [product.id]: true,
                        }));
                      }}
                    />
                  </motion.div>
                </motion.div>
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
                  className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-full p-2 shadow-lg z-20"
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
                className="absolute top-3 left-3 z-20 bg-white backdrop-blur-md rounded-full px-3 py-1.5 shadow-md border border-white/60"
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
                className="absolute bottom-0 left-0 right-0 z-20 p-3 md:p-4 pointer-events-none"
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
                    <p className="text-white/85 text-[11px] md:text-[12px] line-clamp-2 leading-snug drop-shadow-md">
                      {product.description}
                    </p>
                  </div>

                  {/* Add to Basket Button */}
                  <Button
                    size="sm"
                    variant="marketplace"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd(product.id);
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

              {/* Subtle shimmer effect */}
              <motion.div
                className="absolute inset-0 opacity-0 pointer-events-none z-[5]"
                animate={{
                  opacity: isHovered && product.isAvailable ? [0, 0.05, 0] : 0,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  background:
                    "linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)",
                  backgroundSize: "200% 100%",
                }}
              />
            </Card>
          </motion.div>
        );
      })}

      {/* Premium Image Expansion Modal */}
      {expandedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl"
          onClick={() => {
            setExpandedImage(null);
            setImageScale(1);
            setDragY(0);
          }}
        >
          {/* Close button - prominent and always visible */}
          <button
            onClick={() => {
              setExpandedImage(null);
              setImageScale(1);
              setDragY(0);
            }}
            className="absolute top-4 right-4 z-[10001] bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 transition-all duration-200 active:scale-95 shadow-lg pointer-events-auto"
            aria-label="Close image viewer"
          >
            <Icon icon="ph:x" className="w-6 h-6 text-white" />
          </button>

          {/* Zoom controls */}
          <div className="absolute bottom-24 md:top-1/2 md:-translate-y-1/2 right-4 z-[10001] flex flex-col gap-2 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setImageScale((prev) => Math.min(prev + 0.5, 3));
              }}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 transition-all duration-200 active:scale-95"
              aria-label="Zoom in"
            >
              <Icon
                icon="ph:magnifying-glass-plus"
                className="w-5 h-5 text-white"
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setImageScale((prev) => Math.max(prev - 0.5, 1));
              }}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 transition-all duration-200 active:scale-95"
              aria-label="Zoom out"
            >
              <Icon
                icon="ph:magnifying-glass-minus"
                className="w-5 h-5 text-white"
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setImageScale(1);
              }}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 transition-all duration-200 active:scale-95"
              aria-label="Reset zoom"
            >
              <Icon icon="ph:arrows-in" className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Image container with drag and zoom */}
          <motion.div
            drag={imageScale > 1 ? true : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={imageScale > 1 ? 0.1 : 0.2}
            onDragEnd={(_, info) => {
              if (imageScale === 1 && Math.abs(info.offset.y) > 100) {
                setExpandedImage(null);
                setImageScale(1);
                setDragY(0);
              }
            }}
            className="relative flex items-center justify-center p-4 md:p-8 pointer-events-none"
          >
            <motion.div
              animate={{ scale: imageScale }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-[90vw] md:w-[70vh] aspect-square pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src={expandedImage.image}
                  alt={expandedImage.name}
                  fill
                  className="object-cover"
                  quality={100}
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `/api/placeholder/1200/1200?text=${encodeURIComponent(
                      expandedImage.name,
                    )}`;
                  }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Minimal Product info bar - doesn't cover image */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-4 left-4 right-4 md:left-8 md:right-8 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-3 md:p-4 flex items-center justify-between gap-3 max-w-4xl mx-auto border border-white/10">
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-sm md:text-base font-semibold truncate">
                  {expandedImage.name}
                </h3>
                <p className="text-white text-lg md:text-xl font-bold">
                  ₦ {expandedImage.price.toLocaleString()}
                </p>
              </div>
              <Button
                size="sm"
                variant="marketplace"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdd(expandedImage.id);
                  toast.success("Added to basket!");
                  // Close modal after adding to basket
                  setTimeout(() => {
                    setExpandedImage(null);
                    setImageScale(1);
                    setDragY(0);
                  }, 300);
                }}
                disabled={!expandedImage.isAvailable}
                className="rounded-full font-medium gap-2 px-4 md:px-6 py-5 md:py-6 text-sm md:text-base flex-shrink-0"
              >
                <Icon
                  icon="streamline-ultimate:shopping-basket-1"
                  className="text-black font-bold h-4 w-4 md:h-5 md:w-5"
                />
                <span className="hidden sm:inline">
                  {expandedImage.isAvailable ? "Add to basket" : "Out of stock"}
                </span>
              </Button>
            </div>
          </motion.div>

          {/* Swipe indicator for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 md:hidden pointer-events-none"
          >
            <div className="bg-white/20 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2">
              <Icon icon="ph:swipe-down" className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-xs">Swipe down to close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
