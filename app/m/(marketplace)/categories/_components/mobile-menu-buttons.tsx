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
import { ProductCard } from "./product-card";
import { useRouter, usePathname } from "next/navigation";

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
  searchQuery?: string;
  vendorName?: string;
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
  searchQuery = "",
  vendorName = "Marketplace",
}: MobileMenuButtonsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [menuProducts, setMenuProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
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
      <div className="grid grid-cols-3 md:gap-4 gap-px py-6 pt-4">
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
      <div className="h-10">
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
                <Icon
                  icon="lsicon:switch-outline"
                  className="text-[#6A70FF] w-4 h-4"
                />
              </div>
              <span className="text-[#1F2937] font-medium text-xs">
                Change receiver
              </span>
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

      <div className="grid grid-cols-3 md:gap-4 md:py-2">
        {(searchQuery
          ? menuProducts.filter(
              (p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase()),
            )
          : menuProducts
        ).map((product) => {
          const basketItem = basket.find((item) => item.id === product.id);
          const itemCount = basketItem?.qty || 0;
          const isItemActive = activeProductId === product.id || itemCount > 0;

          return (
            <ProductCard
              key={product.id}
              product={product}
              basket={basket}
              onExpand={() => {}} 
              onAdd={handleAdd}
            />
          );
        })}
      </div>
    </div>
  );
}


