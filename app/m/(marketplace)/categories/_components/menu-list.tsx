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
import { ProductCard } from "./product-card";
import { ImageSlider } from "./image-slider";

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
  const [loadingMore, setLoadingMore] = useState(false);
  const [expandedImage, setExpandedImage] = useState<Product | null>(null);
  const [expandedImageIndex, setExpandedImageIndex] = useState(0);
  const [imageScale, setImageScale] = useState(1);
  const [dragY, setDragY] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Track image loading state for each product
  const [imageLoadedStates, setImageLoadedStates] = useState<
    Record<string, boolean>
  >({});

  // Use a single debounce ref per product for better consistency
  const debounceRefs = useRef<{ [key: string]: NodeJS.Timeout | null }>({});
  // Track accumulated clicks for each product
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
      {menuProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          basket={basket}
          onExpand={(p: Product, index?: number) => {
            setExpandedImage(p);
            setExpandedImageIndex(index || 0);
          }}
          onAdd={handleAdd}
          hoverId={hoverId}
          setHoverId={setHoverId}
        />
      ))}

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
                  enableAutoplay={false} // Don't autoplay in expanded view unless explicitly requested
                  showArrows={true} // Show arrows in modal for better UX
                  className="h-full w-full"
                  imageClassName="object-contain" // Use object-contain for expanded view to see full image
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

                <p className="text-white text-lg md:text-xl font-bold mt-1">
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
