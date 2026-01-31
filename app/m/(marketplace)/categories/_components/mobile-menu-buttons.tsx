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
            Math.abs(clicksToSend),
          );
          if (!(result.code === 200 || result.code === 201)) {
            toast.error("Failed to sync removal with server");
          }
        } else if (clicksToSend > 0) {
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
      <div className="grid grid-cols-2 gap-3 py-6 pt-4">
        {Array.from({ length: 6 }).map((_, index) => (
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

  // Calculate total items in basket
  const totalItems = basket.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="space-y-4">
      {/* Clear All button - only show when basket has items */}
      <div className="h-10">
        {totalItems > 0 && (
          <div className="flex justify-end items-end px-2">
            <Button
              variant="ghost"
              className="text-amber-700 text-xs px-3 py-1 h-7 rounded-3xl hover:bg-amber-50"
              onClick={(e) => {
                e.stopPropagation();
                clearBasket();
              }}
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 md:py-2">
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
                <div className="absolute inset-0 cursor-zoom-in group/image bg-gray-100 overflow-hidden">
                  <ImageSlider
                    images={
                      product.images && product.images.length > 0
                        ? product.images
                        : [product.image]
                    }
                    alt={product.name}
                    autoplayDelay={3500 + Math.random() * 1000}
                    onImageClick={(index) => {
                      setExpandedImage(product);
                      setExpandedImageIndex(index);
                    }}
                    showArrows={false}
                    className="h-full w-full"
                    imageClassName={cn(
                      "transition-transform duration-700 ease-out",
                      isHovered && "scale-110",
                    )}
                  />

                  {/* Elegant zoom indicator - top right */}
                  <motion.div
                    className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-full p-1.5 shadow-lg z-20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      scale: isHovered ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Icon
                      icon="ph:magnifying-glass-plus"
                      className="w-3 h-3 text-white"
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
                  className="absolute top-2 left-2 z-20 bg-white/80 backdrop-blur-md rounded-full px-2.5 py-1 shadow-md border border-white/60"
                  animate={{
                    scale: isHovered ? 1.05 : 1,
                    opacity: isHovered ? 1 : 0.85,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="font-semibold text-[11px] bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                    ₦{product.price.toLocaleString()}
                  </p>
                </motion.div>

                {/* Quantity Badge - Top right when items in basket */}
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
                    <span className="text-[11px] font-bold">{itemCount}</span>
                  </motion.div>
                )}

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
                    <div className="space-y-1.5">
                      <h3 className="text-white text-[14px] font-semibold tracking-tight leading-snug drop-shadow-lg line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-white/95 text-[12px] leading-relaxed drop-shadow-md line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    {product.isAvailable ? (
                      <>
                        {itemCount === 0 ? (
                          <Button
                            size="sm"
                            variant="marketplace"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdd(product.id);
                            }}
                            className={cn(
                              "w-full rounded-full font-semibold text-[12px] gap-1.5 flex items-center justify-center h-9 transition-all duration-300 pointer-events-auto",
                              "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_30px_-6px_rgba(147,51,234,0.4)]",
                              "hover:bg-marketplace-primary/80",
                              "border-2 border-marketplace-primary/60 hover:border-marketplace-primary",
                            )}
                          >
                            <Icon
                              icon="streamline-ultimate:shopping-basket-1"
                              className="text-gray-900 h-4 w-4"
                            />
                            <span className="text-gray-900 font-semibold">
                              Add to basket
                            </span>
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2 pointer-events-auto">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(product.id);
                              }}
                              className="rounded-full h-9 w-9 p-0 flex items-center justify-center bg-white/90 hover:bg-white border-2"
                            >
                              <Icon icon="mdi:minus" className="h-4 w-4" />
                            </Button>

                            <div className="flex-1 text-center bg-white/90 rounded-full h-9 flex items-center justify-center border-2 border-white/80">
                              <motion.span
                                initial={{ scale: 1 }}
                                animate={{
                                  scale:
                                    shakeId === product.id ? [1, 1.2, 1] : 1,
                                }}
                                transition={{ duration: 0.3 }}
                                className="font-bold text-sm text-gray-900"
                              >
                                {itemCount}
                              </motion.span>
                            </div>

                            <Button
                              size="sm"
                              variant="marketplace"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAdd(product.id);
                              }}
                              className="rounded-full h-9 w-9 p-0 flex items-center justify-center bg-marketplace-primary hover:bg-marketplace-primary/80 border-2 border-marketplace-primary/60"
                            >
                              <Icon
                                icon="mdi:plus"
                                className="h-4 w-4 text-gray-900"
                              />
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full rounded-full bg-gray-500/80 text-white text-[12px] font-medium h-9 flex items-center justify-center">
                        Out of stock
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Subtle shimmer effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 pointer-events-none z-[5]"
                  animate={{
                    opacity:
                      isHovered && product.isAvailable ? [0, 0.05, 0] : 0,
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

        {/* Infinite Scroll Loading Indicator - Skeleton Cards */}
        {loadingMore && (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={`loading-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="w-full"
              >
                <Card className="overflow-hidden rounded-3xl bg-gradient-to-br from-white/95 via-white/90 to-white/95 backdrop-blur-xl border-[1.5px] border-gray-200/60 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] aspect-[3/4] relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse"></div>
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-100 to-amber-50 rounded-full h-8 w-20 border border-amber-200/40 animate-pulse"></div>
                </Card>
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
                <p className="text-white/70 text-xs md:text-sm mt-1 line-clamp-2">
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
