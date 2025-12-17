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
          toast.error("Failed to sync with server");
        } else {
          // Reset click count after successful sync
          clickCountRefs.current[productId] = 0;
        }
      } catch (error) {
        toast.error("Failed to sync with server");
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
          <Card
            key={product.id}
            className="overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 bg-white border-[1px] flex flex-row w-full md:min-w-[300px] p-2 gap-2 relative"
          >
            {/* Image */}
            <div className="relative w-[100px] h-[100px] flex-shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                width={200}
                height={200}
                className="object-cover w-full h-full rounded-lg"
                loading="lazy"
                quality={75}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `/api/placeholder/200/200?text=${encodeURIComponent(
                    product.name
                  )}`;
                }}
              />
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
                  onClick={() => handleAdd(product.id)}
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
        );
      })}
    </div>
  );
}
