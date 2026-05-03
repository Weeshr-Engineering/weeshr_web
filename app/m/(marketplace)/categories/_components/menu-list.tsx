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
import { ProductCard } from "./product-card";
import { ImageSlider } from "./image-slider";

interface MenuListProps {
  vendorId: string;
  addToBasket: (id: string) => void;
  basket: BasketItem[];
  products: Product[];
  isAuthenticated: boolean;
  userId?: string;
  clearBasket: () => void;
  onOpenChangeReceiver?: () => void;
  searchQuery?: string;
  vendorName?: string;
}

export function MenuList({
  vendorId,
  addToBasket,
  basket,
  products,
  isAuthenticated,
  userId,
  clearBasket,
  onOpenChangeReceiver,
  searchQuery = "",
  vendorName = "Marketplace",
}: MenuListProps) {
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [menuProducts, setMenuProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
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

  const totalItems = basket.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="space-y-4">
      {/* Utility Bar for Desktop */}
      <div className="flex justify-between items-center h-10">
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

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 py-6 pt-4">
      {(searchQuery
        ? menuProducts.filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.description.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : menuProducts
      ).map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          basket={basket}
          onExpand={() => {}} // Navigation handled inside ProductCard
          onAdd={handleAdd}
        />
      ))}

      {searchQuery &&
        menuProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()),
        ).length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Icon
                icon="ph:magnifying-glass-slash-bold"
                className="w-8 h-8 text-gray-400"
              />
            </div>
            <h3 className="text-gray-900 font-semibold">No products found</h3>
            <p className="text-gray-500 text-sm mt-1">
              We couldn't find anything matching "{searchQuery}"
            </p>
          </div>
        )}

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

    </div>
  );
}
