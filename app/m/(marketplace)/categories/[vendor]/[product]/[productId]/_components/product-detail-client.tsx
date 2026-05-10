"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product, ProductService } from "@/service/product.service";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { ImageSlider } from "../../../../_components/image-slider";
import { ProductCard } from "../../../../_components/product-card";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { BasketItem } from "@/lib/BasketItem";
import { cartService } from "@/service/cart.service";
import axios from "axios";
import { GiftBasket } from "../../../../_components/gift-basket";

interface ProductDetailClientProps {
  initialProduct: Product;
  initialRelatedProducts: Product[];
}

export default function ProductDetailClient({
  initialProduct,
  initialRelatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const [product] = useState<Product>(initialProduct);
  const [relatedProducts] = useState<Product[]>(initialRelatedProducts);
  const [userId, setUserId] = useState<string | null>(null);
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [selectedSize, setSelectedSize] = useState("250 ml");
  const sizes = ["100 ml", "250 ml", "500 ml"];

  useEffect(() => {
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
            },
          );
          if (profileResponse.data?.data?._id) {
            setUserId(profileResponse.data.data._id);
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
    };

    loadBasketAndUser();
  }, []);

  const handleAdd = async (targetId: string) => {
    const productToAdd =
      product?.id === targetId
        ? product
        : relatedProducts.find((p) => p.id === targetId);
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

    if (userId) {
      try {
        await cartService.addItemsToCart({
          userId,
          items: [
            {
              productId: targetId,
              quantity: 1,
              price: productToAdd.price,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to sync cart:", error);
      }
    }

    toast.success("Added to basket!");
  };

  return (
    <div className="h-[100dvh] md:h-auto md:min-h-screen bg-gray-50 flex flex-col md:py-10 overflow-hidden md:overflow-visible">
      <div className="flex-1 bg-white flex flex-col md:w-[90%] md:max-w-6xl md:mx-auto md:rounded-[3rem] md:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden relative h-full">
        {/* Top Navigation - Clean Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 bg-white z-50">
          <button
            onClick={() => router.back()}
            className="bg-[#949BB0] hover:bg-[#83899F] rounded-full px-4 py-2 flex items-center gap-2 text-white text-sm font-medium transition-all active:scale-95"
          >
            <Icon icon="ph:caret-left-bold" className="w-3.5 h-3.5" />
            Back
          </button>

          <h2 className="text-gray-900 font-medium text-xl tracking-tight">
            {product.category || "Lifestyle"}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Image Area - Rounded with Shadow */}
          <div className="px-4 pt-2">
            <div className="relative w-full aspect-[1/1.1] rounded-[2rem] overflow-hidden bg-gray-50 shadow-sm">
              <ImageSlider
                images={
                  product.images && product.images.length > 0
                    ? product.images
                    : [product.image]
                }
                alt={product.name}
                enableAutoplay={false}
                showArrows={false}
                showDots={false}
                className="h-full w-full"
                imageClassName="object-cover"
              />

              {/* Bottom Shadow Gradient - Deeper and taller for better contrast */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />

              {/* Vendor Overlay */}
              <div className="absolute bottom-8 left-6 z-20">
                <span className="text-white font-medium text-2xl tracking-tight">
                  {product.name.split(" ")[0]}!{" "}
                  {product.category || "Lifestyle"}
                </span>
              </div>
            </div>

            {/* Custom Slider Dots - Below Image */}
            <div className="flex gap-1.5 mt-4 px-2">
              <div className="w-8 h-1.5 bg-[#0E0E2C] rounded-full" />
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
            </div>
          </div>

          {/* Details Section */}
          <div className="p-0 md:p-8 space-y-6">
            <div className="p-4 space-y-4">
              {/* Size Selector */}
              <div className="bg-[#EFEEF6] rounded-2xl p-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-sm font-medium text-gray-500 px-4">
                  Size
                </span>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "px-6 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                        selectedSize === size
                          ? "bg-[#0E0E2C] text-white shadow-md"
                          : "bg-white text-gray-900",
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price and Add to Basket Row */}
              <div className="flex items-center justify-between py-2">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-medium">
                    Price
                  </span>
                  <span className="text-2xl font-semibold text-gray-900">
                    ₦ {product.price.toLocaleString()}
                  </span>
                </div>

                <Button
                  variant="outline"
                  className="rounded-full px-5 h-11 border-gray-300 text-gray-900 hover:bg-gray-50 gap-2 font-medium text-sm shadow-sm"
                  onClick={() => handleAdd(product.id)}
                >
                  Add to basket
                  <div className="border border-gray-900 rounded-full p-0.5">
                    <Icon icon="ph:plus-bold" className="w-2.5 h-2.5" />
                  </div>
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
              <div className="pt-10 pb-10 space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 pl-4">
                  Related Products
                </h3>

                <div className="grid grid-cols-3 gap-0.5">
                  {relatedProducts.map((relProduct) => (
                    <div
                      key={relProduct.id}
                      className="aspect-square bg-gray-100 cursor-pointer overflow-hidden hover:opacity-90 transition-opacity"
                      onClick={() =>
                        router.push(
                          `${pathname.split("/").slice(0, -1).join("/")}/${relProduct.id}`,
                        )
                      }
                    >
                      <img
                        src={relProduct.image}
                        alt={relProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Basket for Mobile */}
        <div className="lg:hidden">
          <GiftBasket
            basket={basket}
            products={[product, ...relatedProducts]}
            getBasketTotal={() =>
              basket.reduce((sum, item) => {
                const p = [product, ...relatedProducts].find(
                  (prod) => prod.id === item.id,
                );
                return sum + (p?.price || 0) * item.qty;
              }, 0)
            }
            setBasket={setBasket}
          />
        </div>
      </div>
    </div>
  );
}
