"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product, ProductService } from "@/service/product.service";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { ImageSlider } from "../../../_components/image-slider";
import { ProductCard } from "../../../_components/product-card";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { BasketItem } from "@/lib/BasketItem";
import { cartService } from "@/service/cart.service";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [selectedSize, setSelectedSize] = useState("250 ml");
  const sizes = ["100 ml", "250 ml", "500 ml"];

  useEffect(() => {
    const fetchData = async () => {
      if (!productId) return;
      setLoading(true);
      const data = await ProductService.getProductById(productId);
      setProduct(data);
      
      if (data?.vendorId) {
        const response = await ProductService.getProductsByVendor(data.vendorId, 1, 10);
        setRelatedProducts(response.products.filter(p => p.id !== productId));
      }
      
      setLoading(false);
    };

    const loadBasketAndUser = async () => {
      const savedBasket = localStorage.getItem("weeshr_basket");
      if (savedBasket) {
        setBasket(JSON.parse(savedBasket));
      }

      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        try {
          const profileResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
            {
              headers: { Authorization: `Bearer ${authToken}` },
            }
          );
          if (profileResponse.data?.data?._id) {
            setUserId(profileResponse.data.data._id);
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
    };

    fetchData();
    loadBasketAndUser();
  }, [productId]);

  const handleAdd = async (targetId: string) => {
    // Find the product to add from either current or related
    const productToAdd = product?.id === targetId ? product : relatedProducts.find(p => p.id === targetId);
    if (!productToAdd) return;
    
    const updatedBasket = [...basket];
    const existingItem = updatedBasket.find((item) => item.id === targetId);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      updatedBasket.push({
        id: productToAdd.id,
        name: productToAdd.name,
        qty: 1,
      });
    }

    setBasket(updatedBasket);
    localStorage.setItem("weeshr_basket", JSON.stringify(updatedBasket));
    
    // Sync with server if logged in
    if (userId) {
      try {
        await cartService.addItemsToCart({
          userId,
          items: [
            {
              productId: targetId,
              quantity: 1,
              price: productToAdd.price
            }
          ]
        });
      } catch (error) {
        console.error("Failed to sync cart:", error);
      }
    }
    
    toast.success("Added to basket!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Skeleton className="w-full aspect-square" />
        <div className="p-6 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <Icon icon="ph:mask-sad-bold" className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-xl font-bold text-gray-900">Product not found</h1>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or is unavailable.</p>
        <Button onClick={() => router.back()} variant="marketplace" className="rounded-full px-8">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:py-10">
      <div className="flex-1 bg-white flex flex-col md:w-[90%] md:max-w-6xl md:mx-auto md:rounded-[3rem] md:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden relative">
      {/* Top Navigation */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => router.back()}
          className="bg-white/90 backdrop-blur-md rounded-full p-2.5 shadow-lg hover:bg-white transition-all active:scale-90"
        >
          <Icon icon="ph:caret-left-bold" className="w-5 h-5 text-gray-900" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Image Area */}
        <div className="relative w-full aspect-square bg-gray-50">
          <ImageSlider
            images={product.images && product.images.length > 0 ? product.images : [product.image]}
            alt={product.name}
            enableAutoplay={false}
            showArrows={false}
            showDots={true}
            className="h-full w-full"
            imageClassName="object-cover"
          />
        </div>

        {/* Details Section */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
            <p className="text-sm font-bold text-[#6A70FF] uppercase tracking-widest">
              Available at Vendor
            </p>
          </div>

          <p className="text-base text-gray-500 leading-relaxed">
            {product.description}
          </p>

          {/* Size Selector */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 py-3 px-4 bg-gray-50 rounded-2xl overflow-x-auto no-scrollbar">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest shrink-0">
                Size
              </span>
              <div className="flex items-center gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                      selectedSize === size
                        ? "bg-gray-900 text-white shadow-lg scale-105"
                        : "bg-white text-gray-600 hover:bg-gray-100",
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="pt-10 pb-24 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Related Products
                </h3>
                <span className="text-xs font-bold text-[#6A70FF] uppercase tracking-wider">
                  Scroll to explore
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {relatedProducts.map((relProduct) => (
                  <ProductCard
                    key={relProduct.id}
                    product={relProduct}
                    basket={basket}
                    onExpand={() => {}}
                    onAdd={handleAdd}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="shrink-0 p-4 md:p-8 pb-safe bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex items-center justify-between gap-4 z-50">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-0.5">
            Price
          </span>
          <span className="text-2xl font-black text-gray-900">
            ₦ {product.price.toLocaleString()}
          </span>
        </div>

        <Button
          variant="marketplace"
          className="rounded-full px-8 py-7 h-auto gap-3 text-base font-bold shadow-lg active:scale-95"
          onClick={() => handleAdd(product.id)}
          disabled={!product.isAvailable}
        >
          Add to basket
          <Icon icon="solar:cart-large-minimalistic-bold" className="w-5 h-5" />
        </Button>
      </div>
    </div>
  </div>
);
}
