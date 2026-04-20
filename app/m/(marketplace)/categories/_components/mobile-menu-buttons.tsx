"use client";

import Image from "next/image";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Product, ProductService } from "@/service/product.service";
import { cartService } from "@/service/cart.service";
import toast from "react-hot-toast";
import { BasketItem } from "@/lib/BasketItem";
import { cn } from "@/lib/utils";
import { ImageSlider } from "./image-slider";

interface MobileMenuButtonsProps {
  vendorId: string;
  addToBasket: (id: string) => void;
  basket: BasketItem[];
  setBasket: React.Dispatch<React.SetStateAction<BasketItem[]>>;
  products: Product[];
  isAuthenticated: boolean;
  userId?: string;
  clearBasket: () => void;
  onOpenChangeReceiver?: () => void;
}

export function MobileMenuButtons({
  vendorId,
  addToBasket,
  basket,
  setBasket,
  products,
  isAuthenticated,
  userId,
  clearBasket,
  onOpenChangeReceiver,
}: MobileMenuButtonsProps) {
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [menuProducts, setMenuProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [expandedImage, setExpandedImage] = useState<Product | null>(null);
  const [expandedImageIndex, setExpandedImageIndex] = useState(0);
  const [imageScale, setImageScale] = useState(1);
  const [dragY, setDragY] = useState(0);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const debounceRefs = useRef<{ [key: string]: NodeJS.Timeout | null }>({});
  // Track accumulated clicks per product during debounce period
  const clickCountRefs = useRef<{ [key: string]: number }>({});
  // Ref for infinite scroll observer
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch products when vendorId changes (initial load)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setCurrentPage(1);
        const response = await ProductService.getProductsByVendor(vendorId, 1);
        setMenuProducts(response.products);
        setTotalPages(response.pagination.totalPages);
        setHasMore(
          response.pagination.currentPage < response.pagination.totalPages,
        );
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setMenuProducts([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) fetchProducts();
  }, [vendorId]);

  // Load more products
  // Load more products
  const loadMoreProducts = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await ProductService.getProductsByVendor(
        vendorId,
        nextPage,
      );

      setMenuProducts((prev) => [...prev, ...response.products]);
      setCurrentPage(nextPage);
      setHasMore(nextPage < response.pagination.totalPages);
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Infinite scroll observer
  useEffect(() => {
    if (menuProducts.length > 0) {
      console.log(
        "Client Menu Products Debug:",
        menuProducts.map((p) => ({
          name: p.name,
          imagesCount: p.images?.length,
          hasImages: !!p.images,
        })),
      );
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1, rootMargin: "500px" },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, loadingMore, currentPage, vendorId]);

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

  const handleAdd = (productId: string) => {
    // Update UI immediately
    addToBasket(productId);

    // Shake animation
    setShakeId(productId);
    setTimeout(() => setShakeId(null), 500);

    // Accumulate clicks
    if (!clickCountRefs.current[productId]) {
      clickCountRefs.current[productId] = 0;
    }
    clickCountRefs.current[productId] += 1;

    // Debounce API sync
    if (debounceRefs.current[productId]) {
      clearTimeout(debounceRefs.current[productId]!);
    }

    debounceRefs.current[productId] = setTimeout(async () => {
      if (!isAuthenticated || !userId) return;

      const clicksToSend = clickCountRefs.current[productId];
      clickCountRefs.current[productId] = 0; // Reset after sending

      try {
        const product = products.find((p) => p.id === productId);

        // Send accumulated clicks
        if (clicksToSend < 0) {
          // Handle decrement (unlikely in handleAdd but possible with mixed clicks)
          const result = await cartService.removeItemFromCart(
            userId,
            productId.toString(),
          );
        } else {
          const result = await cartService.addItemsToCart({
            userId,
            items: [
              {
                productId: productId.toString(),
                quantity: clicksToSend,
                price: product?.price || 0,
              },
            ],
          });
          if (!(result.code === 200 || result.code === 201)) {
            // toast.error("Failed to sync with server");
            console.error("Failed to sync with server");
          }
        }
      } catch (error) {
        // toast.error("Failed to sync with server");
        console.error("Sync error:", error);
      }
    }, 600);
  };

  const handleRemove = (productId: string) => {
    setBasket((prev) => {
      const exists = prev.find((i) => i.id === productId);
      if (!exists) return prev;

      // If quantity is 1, remove from basket
      if (exists.qty === 1) {
        const updated = prev.filter((i) => i.id !== productId);

        // Debounce API sync - remove item from cart
        if (debounceRefs.current[productId]) {
          clearTimeout(debounceRefs.current[productId]!);
        }

        debounceRefs.current[productId] = setTimeout(async () => {
          if (!isAuthenticated || !userId) return;

          try {
            const result = await cartService.removeItemFromCart(
              userId,
              productId.toString(),
            );
            if (!(result.code === 200 || result.code === 201)) {
              toast.error("Failed to sync removal with server");
            }
          } catch (error) {
            toast.error("Failed to sync removal with server");
            console.error("Sync error:", error);
          }
        }, 600);

        return updated;
      }

      // Otherwise decrease quantity
      const updated = prev.map((i) =>
        i.id === productId ? { ...i, qty: i.qty - 1 } : i,
      );

      // Accumulate clicks (negative for decrement)
      if (!clickCountRefs.current[productId]) {
        clickCountRefs.current[productId] = 0;
      }
      clickCountRefs.current[productId] -= 1;

      // Debounce API sync
      if (debounceRefs.current[productId]) {
        clearTimeout(debounceRefs.current[productId]!);
      }

      debounceRefs.current[productId] = setTimeout(async () => {
        if (!isAuthenticated || !userId) return;

        const clicksToSend = clickCountRefs.current[productId];
        clickCountRefs.current[productId] = 0; // Reset after sending

        try {
          const product = products.find((p) => p.id === productId);

          // Send accumulated clicks
          if (clicksToSend < 0) {
            // Handle decrement
            const result = await cartService.removeItemFromCart(
              userId,
              productId.toString(),
              Math.abs(clicksToSend),
            );
            if (!(result.code === 200 || result.code === 201)) {
              toast.error("Failed to sync removal with server");
            }
          } else if (clicksToSend > 0) {
            // Handle increment
            const result = await cartService.addItemsToCart({
              userId,
              items: [
                {
                  productId: productId.toString(),
                  quantity: clicksToSend, // Send accumulated clicks
                  price: product?.price || 0,
                },
              ],
            });
            if (!(result.code === 200 || result.code === 201)) {
              toast.error("Failed to sync quantity with server");
            }
          }
        } catch (error) {
          // toast.error("Failed to sync with server");
          console.error("Sync error:", error);
        }
      }, 600);

      return updated;
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-px py-6 pt-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <Card
            key={index}
            className="overflow-hidden rounded-none bg-gray-100 aspect-square relative animate-pulse"
          />
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

  // Calculate total items in basket
  const totalItems = basket.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="space-y-4">
      {/* Clear All button - only show when basket has items */}
      <div className="h-10 px-4">
        <div className="flex justify-between items-center h-full">
          {onOpenChangeReceiver && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenChangeReceiver();
              }}
              className="flex flex-row gap-2 items-center text-sm hover:bg-gray-50 transition-colors duration-200 py-1.5 px-3 rounded-full cursor-pointer"
            >
              <div className="border-[#6A70FF] border-2 rounded-md p-0.5 w-7 h-7 flex items-center justify-center">
                <Icon icon="lsicon:switch-outline" className="text-[#6A70FF] w-4 h-4" />
              </div>
              <span className="text-[#1F2937] font-medium text-xs">Change receiver</span>
            </button>
          )}

          <button
            disabled={totalItems <= 1}
            className={cn(
              "text-[10px] uppercase tracking-widest px-3 py-1 transition-all duration-300",
              totalItems > 1
                ? "text-red-500 font-bold opacity-100 hover:scale-105 active:scale-95"
                : "text-gray-400 font-medium opacity-10 blur-[0.5px] cursor-not-allowed",
            )}
            onClick={(e) => {
              e.stopPropagation();
              clearBasket();
            }}
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 md:py-2">
        {menuProducts.map((product) => {
          const basketItem = basket.find((item) => item.id === product.id);
          const itemCount = basketItem?.qty || 0;
          const isItemActive = activeProductId === product.id || itemCount > 0;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
              onClick={() => {
                if (activeProductId !== product.id) {
                  setActiveProductId(product.id);
                }
              }}
              onMouseEnter={() => {
                if (activeProductId !== product.id) {
                  setActiveProductId(product.id);
                }
              }}
              onMouseLeave={() => {
                if (activeProductId === product.id) {
                  setActiveProductId(null);
                }
              }}
            >
              <Card
                className={cn(
                  "overflow-hidden rounded-none transition-all duration-300 relative aspect-square flex flex-col",
                  "bg-gray-100 border-none",
                  product.isAvailable
                    ? "cursor-pointer"
                    : "opacity-50 cursor-not-allowed",
                )}
              >
                {/* Image Container */}
                <div className="absolute inset-0 bg-gray-100 overflow-hidden">
                  <ImageSlider
                    images={
                      product.images && product.images.length > 0
                        ? product.images
                        : [product.image]
                    }
                    alt={product.name}
                    autoplayDelay={3500 + Math.random() * 1000}
                    onImageClick={(index) => {
                      if (isItemActive) {
                        setExpandedImage(product);
                        setExpandedImageIndex(index);
                      } else {
                        setActiveProductId(product.id);
                      }
                    }}
                    showArrows={false}
                    className="h-full w-full"
                    imageClassName={cn(
                      "transition-transform duration-700 ease-out",
                      isItemActive && "scale-105",
                    )}
                  />

                  {/* Base Gradient - Always visible for name readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

                  {/* Active/Selection Overlay - revealing buttons and price */}
                  <AnimatePresence>
                    {isItemActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-20 pointer-events-none"
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Revealed Content: Price and Controls */}
                <AnimatePresence>
                  {isItemActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute inset-0 z-40 p-3 flex flex-col justify-between pointer-events-none"
                    >
                      {/* Top Row: Price */}
                      <div className="flex justify-start">
                        <span className="text-[10px] font-bold text-gray-800 bg-white/95 backdrop-blur-md rounded-full px-2 py-0.5 shadow-sm border border-white/40">
                          ₦{product.price.toLocaleString()}
                        </span>
                      </div>

                      {/* Middle: Name and Description - Restored details */}
                      <div className="flex flex-col gap-0.5">
                        <h4 className="text-white text-[11px] font-bold leading-tight drop-shadow-md line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-white/80 text-[10px] leading-tight drop-shadow-sm line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      {/* Action Row - Bottom Right */}
                      <div className="flex justify-end items-end h-10 pointer-events-auto">
                        {product.isAvailable ? (
                          itemCount === 0 ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAdd(product.id);
                              }}
                              className="w-9 h-9 bg-marketplace-primary text-gray-900 rounded-full flex items-center justify-center shadow-lg active:scale-90 border border-white/30"
                            >
                              <Icon icon="mdi:plus" className="w-6 h-6" />
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-full p-1 shadow-xl border border-white/50">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemove(product.id);
                                }}
                                className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-90"
                              >
                                <Icon
                                  icon="mdi:minus"
                                  className="w-4 h-4 text-red-500"
                                />
                              </button>

                              <span className="text-[13px] font-bold px-1 min-w-[14px] text-center text-gray-900">
                                {itemCount}
                              </span>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAdd(product.id);
                                }}
                                className="w-8 h-8 bg-marketplace-primary rounded-full flex items-center justify-center shadow-sm active:scale-90"
                              >
                                <Icon
                                  icon="mdi:plus"
                                  className="w-4 h-4 text-gray-900"
                                />
                              </button>
                            </div>
                          )
                        ) : (
                          <div className="w-8 h-8 bg-gray-500/80 text-white rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Icon icon="mdi:close" className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Selection border/indicator */}
                {isItemActive && (
                  <div className="absolute inset-0 border-2 border-marketplace-primary/40 rounded-none z-50 pointer-events-none" />
                )}
              </Card>
            </motion.div>
          );
        })}

        {/* Infinite Scroll Loading Indicator - Skeleton Cards */}
        {loadingMore && (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={`loading-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="w-full"
              >
                <Card className="overflow-hidden rounded-2xl bg-gray-100 aspect-square relative animate-pulse" />
              </motion.div>
            ))}
          </>
        )}

        {/* Infinite Scroll Trigger */}
        <div ref={loadMoreRef} className="col-span-full h-10 w-full" />

        {/* End of products message */}
        {!hasMore && menuProducts.length > 0 && (
          <div className="col-span-full flex flex-col items-center gap-2 py-8 pb-10">
            <Icon
              icon="material-symbols:check-circle-outline"
              height={32}
              width={32}
              className="text-marketplace-primary"
            />
            <p className="text-sm font-medium text-muted-foreground">
              hoohooo you've reached the end 🥰
            </p>
          </div>
        )}
      </div>

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
                <ImageSlider
                  images={
                    expandedImage.images && expandedImage.images.length > 0
                      ? expandedImage.images
                      : [expandedImage.image]
                  }
                  alt={expandedImage.name}
                  startIndex={expandedImageIndex}
                  enableAutoplay={false}
                  showArrows={true}
                  showThumbnails={true}
                  showDots={false}
                  className="h-full w-full"
                  imageClassName="object-contain"
                  aspectRatio="aspect-square"
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
                <p className="text-white/70 text-xs md:text-sm mt-1">
                  {expandedImage.description}
                </p>
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
