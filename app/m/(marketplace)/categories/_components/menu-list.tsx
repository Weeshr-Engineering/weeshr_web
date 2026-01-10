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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 pt-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card
            key={index}
            className="overflow-hidden rounded-2xl shadow-sm bg-white border-[1px] flex flex-row min-w-[300px] p-2 gap-2 animate-pulse"
          >
            <div className="relative w-[100px] h-[100px] flex-shrink-0 bg-gray-200 rounded-lg"></div>
            <div className="flex flex-col justify-between flex-1 min-w-0 space-y-2">
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-7 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 pt-4">
      {menuProducts.map((product) => {
        const basketItem = basket.find((item) => item.id === product.id);
        const itemCount = basketItem?.qty || 0;

        return (
          <motion.div
            key={product.id}
            whileTap={product.isAvailable ? { scale: 0.98 } : {}}
            className="w-full"
          >
            <Card
              onClick={() => product.isAvailable && handleAdd(product.id)}
              onMouseEnter={() => setHoverId(product.id)}
              onMouseLeave={() => setHoverId(null)}
              className={cn(
                "overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 bg-white border-[1px] flex flex-row w-full md:min-w-[300px] p-2 gap-2 relative h-full",
                product.isAvailable
                  ? "cursor-pointer"
                  : "opacity-60 cursor-not-allowed"
              )}
            >
              {/* Image */}
              <div
                className="relative w-[100px] aspect-square flex-shrink-0 overflow-hidden rounded-lg cursor-zoom-in group"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedImage(product);
                }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full rounded-lg transition-transform hover:scale-105"
                  loading="lazy"
                  quality={75}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `/api/placeholder/200/200?text=${encodeURIComponent(
                      product.name
                    )}`;
                  }}
                />
                {/* Zoom indicator */}
                <div className="absolute top-1 right-1 bg-black/50 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon
                    icon="ph:magnifying-glass-plus"
                    className="w-3 h-3 text-white"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <CardTitle className="text-sm font-normal">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-xs mb-2 text-muted-foreground line-clamp-2">
                    {product.description}
                  </CardDescription>
                </div>

                <div className="flex justify-between items-center text-md">
                  <p className="font-semibold">
                    ₦ {product.price.toLocaleString()}
                  </p>

                  <Button
                    size="sm"
                    variant="marketplace"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd(product.id);
                    }}
                    onMouseEnter={() => setHoverId(product.id)}
                    onMouseLeave={() => setHoverId(null)}
                    className="rounded-full sm:rounded-3xl font-light text-xs gap-1 flex items-center py-0.5 h-7"
                    disabled={!product.isAvailable}
                  >
                    {/* Text visible only on md+ screens */}
                    {product.isAvailable && (
                      <span className="hidden sm:inline lg:hidden xl:inline">
                        Add to basket
                      </span>
                    )}
                    {!product.isAvailable && (
                      <span className="hidden sm:inline lg:hidden xl:inline">
                        Out of stock
                      </span>
                    )}

                    {/* Icon always visible */}
                    <motion.span
                      initial={{ x: 0, scale: 1, rotate: 0 }}
                      animate={{
                        x: shakeId === product.id ? [-6, 6, -6, 6, 0] : 0,
                        scale: hoverId === product.id ? 1.18 : 1,
                        rotate: hoverId === product.id ? 8 : 0,
                      }}
                      transition={{
                        x:
                          shakeId === product.id
                            ? { duration: 0.45, ease: "easeInOut" }
                            : { duration: 0.18 },
                        scale: { duration: 0.15, ease: "easeOut" },
                        rotate: { duration: 0.18, ease: "easeOut" },
                      }}
                      className="flex sm:ml-2 lg:ml-0 xl:ml-2"
                    >
                      <Icon
                        icon="streamline-ultimate:shopping-basket-1"
                        className="text-black font-bold h-4 w-4"
                      />
                    </motion.span>
                  </Button>
                </div>
              </div>
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
              className="relative max-w-4xl max-h-[80vh] md:max-h-[85vh] w-full pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={expandedImage.image}
                alt={expandedImage.name}
                width={1200}
                height={1200}
                className="object-contain w-full h-full rounded-2xl"
                quality={100}
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `/api/placeholder/1200/1200?text=${encodeURIComponent(
                    expandedImage.name
                  )}`;
                }}
              />
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
