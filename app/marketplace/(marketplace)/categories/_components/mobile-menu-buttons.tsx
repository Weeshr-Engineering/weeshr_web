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
  const [menuProducts, setMenuProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const debounceRefs = useRef<{ [key: string]: NodeJS.Timeout | null }>({});
  // Track accumulated clicks per product during debounce period
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
            Math.abs(clicksToSend)
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
            toast.error("Failed to sync with server");
          }
        }
      } catch (error) {
        toast.error("Failed to sync with server");
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
              productId.toString()
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
        i.id === productId ? { ...i, qty: i.qty - 1 } : i
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
              Math.abs(clicksToSend)
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
          toast.error("Failed to sync with server");
          console.error("Sync error:", error);
        }
      }, 600);

      return updated;
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 py-6 pt-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card
            key={index}
            className="overflow-hidden rounded-2xl shadow-sm bg-white border-[1px] flex flex-row p-2 gap-2 animate-pulse"
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
              className="text-[#6A70FF] text-xs px-3 py-1 h-7 rounded-3xl hover:bg-[#6A70FF]/10"
              onClick={clearBasket}
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:py-2">
        {menuProducts.map((product) => {
          const basketItem = basket.find((item) => item.id === product.id);
          const itemCount = basketItem?.qty || 0;

          return (
            <Card
              key={product.id}
              className="overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 bg-white border-[1px] flex flex-row w-full p-2 gap-2 relative"
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

                  {/* BUTTON LOGIC */}
                  {product.isAvailable ? (
                    <>
                      {/* Show basket icon FIRST when itemCount = 0 */}
                      {itemCount === 0 && (
                        <Button
                          size="sm"
                          variant="marketplace"
                          onClick={() => handleAdd(product.id)}
                          className="rounded-full h-7 w-7 p-0 flex items-center justify-center"
                        >
                          <motion.span
                            initial={{ scale: 1 }}
                            animate={{
                              scale: shakeId === product.id ? [1, 1.2, 1] : 1,
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <Icon
                              icon="streamline-ultimate:shopping-basket-1"
                              className="h-4 w-4 text-black"
                            />
                          </motion.span>
                        </Button>
                      )}

                      {/* Show qty controls when itemCount > 0 */}
                      {itemCount > 0 && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemove(product.id)}
                            className="rounded-full h-7 w-7 p-0 flex items-center justify-center"
                          >
                            <Icon icon="mdi:minus" className="h-4 w-4" />
                          </Button>

                          <motion.span
                            initial={{ scale: 1 }}
                            animate={{
                              scale: shakeId === product.id ? [1, 1.2, 1] : 1,
                            }}
                            transition={{ duration: 0.3 }}
                            className="font-semibold text-sm min-w-[20px] text-center"
                          >
                            {itemCount}
                          </motion.span>

                          <Button
                            size="sm"
                            variant="marketplace"
                            onClick={() => handleAdd(product.id)}
                            className="rounded-full h-7 w-7 p-0 flex items-center justify-center"
                          >
                            <motion.span
                              initial={{ scale: 1 }}
                              animate={{
                                scale: shakeId === product.id ? [1, 1.2, 1] : 1,
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              <Icon icon="mdi:plus" className="h-4 w-4" />
                            </motion.span>
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Out of stock
                    </span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
