"use client";

import Image from "next/image";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Product, ProductService } from "@/service/product.service";

interface MenuListProps {
  vendorId: string;
  addToBasket: (id: string) => void;
}

export function MenuList({ vendorId, addToBasket }: MenuListProps) {
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products when vendorId changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await ProductService.getProductsByVendor(vendorId);
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) {
      fetchProducts();
    }
  }, [vendorId]);

  const handleAdd = (id: string) => {
    addToBasket(id);
    setShakeId(id);
    setTimeout(() => setShakeId(null), 500); // reset after shake
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

  if (products.length === 0 && !loading) {
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
      {products.map((product) => (
        <Card
          key={product.id}
          className="overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 bg-white border-[1px] flex flex-row min-w-[300px] p-2 gap-2"
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

              {/* Button stays still; we detect hover on it and animate icon only */}
              <Button
                size="sm"
                variant="marketplace"
                onClick={() => handleAdd(product.id)}
                onMouseEnter={() => setHoverId(product.id)}
                onMouseLeave={() => setHoverId(null)}
                className="rounded-3xl font-light text-xs gap-1 flex items-center py-0.5 h-7"
                disabled={!product.isAvailable}
              >
                {product.isAvailable ? "Add to basket" : "Out of stock"}
                {/* motion.span drives BOTH hover-zoom & click-shake smoothly */}
                <motion.span
                  initial={{ x: 0, scale: 1, rotate: 0 }}
                  animate={{
                    // shake (x) only when clicked
                    x: shakeId === product.id ? [-6, 6, -6, 6, 0] : 0,
                    // hover scale/rotate only when hovering parent button
                    scale: hoverId === product.id ? 1.18 : 1,
                    rotate: hoverId === product.id ? 8 : 0,
                  }}
                  transition={{
                    // separate transitions so scale/rotate feel snappy while shake uses its own timing
                    x:
                      shakeId === product.id
                        ? { duration: 0.45, ease: "easeInOut" }
                        : { duration: 0.18 },
                    scale: { duration: 0.15, ease: "easeOut" },
                    rotate: { duration: 0.18, ease: "easeOut" },
                  }}
                  className="flex ml-2"
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
      ))}
    </div>
  );
}
