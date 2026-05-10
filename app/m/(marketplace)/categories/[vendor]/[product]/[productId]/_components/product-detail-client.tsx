"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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
import { MenuList } from "../../../../_components/menu-list";
import { MobileMenuButtons } from "../../../../_components/mobile-menu-buttons";

interface ProductDetailClientProps {
  initialProduct: Product;
  initialRelatedProducts: Product[];
}

export default function ProductDetailClient({
  initialProduct,
  initialRelatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [product] = useState<Product>(initialProduct);
  const [relatedProducts] = useState<Product[]>(initialRelatedProducts);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [basket, setBasket] = useState<BasketItem[]>([]);

  const formattedProductName = product.name
    ? product.name
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ")
    : "";

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
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
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
      updatedBasket.unshift({
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
  };

  const allProducts = [product, ...relatedProducts];

  const getBasketTotal = () =>
    basket.reduce((sum, item) => {
      const p = allProducts.find((prod) => prod.id === item.id);
      return sum + (p?.price || 0) * item.qty;
    }, 0);

  const handleBack = () => {
    const segments = pathname.split("/");
    segments.pop(); // Remove productId segment
    const vendorUrl = segments.join("/") + window.location.search;
    router.push(vendorUrl);
  };

  // Shared product image / detail block
  const ProductDetail = () => (
    <>
      {/* Image */}
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
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />
          <div className="absolute bottom-8 left-6 z-20">
            <span className="text-white font-medium text-2xl tracking-tight">
              {formattedProductName.split(" ")[0]}!{" "}
              {product.category || "Lifestyle"}
            </span>
          </div>
        </div>
        <div className="flex gap-1.5 mt-4 px-2">
          <div className="w-8 h-1.5 bg-[#0E0E2C] rounded-full" />
          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
        </div>
      </div>

      {/* Price + description */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium">Price</span>
            <span className="text-2xl font-medium text-gray-900">
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
        <p className="text-sm text-gray-600 leading-relaxed">
          {product.description}
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* ── DESKTOP: Full-width Luxury Layout (matches vendor page) ── */}
      <div className="hidden lg:flex flex-col min-h-screen bg-[#F9FAFB]">
        {/* Hero Banner Section - Ultra immersive product image */}
        <section className="relative w-full aspect-[45/6] overflow-hidden shadow-lg bg-gray-900">
          <ImageSlider
            images={
              product.images && product.images.length > 0
                ? product.images
                : [product.image]
            }
            alt={product.name}
            enableAutoplay={true}
            showArrows={true}
            showDots={false}
            className="absolute inset-0 w-full h-full opacity-60"
            imageClassName="object-cover w-full h-full object-center blur-3xl scale-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30 z-10" />

          {/* Floating Controls */}
          <div className="absolute top-6 left-8 right-8 flex items-center justify-between z-20">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-all active:scale-95 shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
            >
              <Icon icon="ph:caret-left-bold" width="18" />
              <span className="text-sm font-medium tracking-wide">Back</span>
            </button>
          </div>
        </section>

        {/* Indigo Header Bar - Luxurious Overlap */}
        <section className="bg-[#3B41B1] sticky top-0 z-30 rounded-t-[2rem] -mt-16 border-t border-white/10 shadow-2xl">
          <div className="max-w-[85rem] mx-auto w-full px-10 py-6 pt-5 pb-[3.5rem] flex items-center justify-between">
            <div className="flex flex-col max-w-2xl">
              <h2 className="text-white font-medium text-3xl tracking-tight leading-tight">
                {formattedProductName}
              </h2>
              <div className="flex items-center gap-2 mt-1.5 opacity-90">
                <span className="text-white/80 font-medium text-sm tracking-wide uppercase">
                  {product.category || "Product"}
                </span>
                <span className="text-white/40">•</span>
                <span className="text-white/80 font-medium text-sm">
                  By {formattedProductName.split(" ")[0]}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-white/70 text-xs font-medium uppercase tracking-wider mb-0.5">
                  Price
                </span>
                <span className="text-white font-medium text-2xl tracking-tight">
                  ₦ {product.price.toLocaleString()}
                </span>
              </div>
              <Button
                className="rounded-full px-6 h-12 bg-white text-[#3B41B1] hover:bg-white/90 gap-2 font-bold text-sm shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-all hover:scale-105 active:scale-95"
                onClick={() => handleAdd(product.id)}
              >
                Add to basket
                <div className="bg-[#3B41B1]/10 rounded-full p-1 ml-1">
                  <Icon icon="ph:plus-bold" className="w-3.5 h-3.5" />
                </div>
              </Button>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-white rounded-t-[1.5rem] -mt-10 relative z-40 shadow-[0_-15px_50px_rgba(0,0,0,0.06)] mb-12">
          <div className="px-10 w-full max-w-[85rem] mx-auto flex-1 pt-10">
            <div className="flex flex-row gap-12">
              {/* Left Column: Image, Description & More from Vendor */}
              <div className="flex-1 min-w-0">
                {/* Product Image Gallery (Desktop) */}
                <div className="mb-10 w-full max-w-4xl">
                  <div className="relative w-full aspect-[16/9] lg:aspect-[2/1] rounded-[2rem] overflow-hidden bg-gray-50 shadow-sm">
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
                    {/* Vintage bottom gradient and text overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />
                    <div className="absolute bottom-8 left-6 z-20">
                      <span className="text-white font-medium text-2xl tracking-tight">
                        {formattedProductName.split(" ")[0]}!{" "}
                        {product.category || "Lifestyle"}
                      </span>
                    </div>
                  </div>

                  {/* Vintage custom dots below image */}
                  <div className="flex gap-1.5 mt-4 px-2">
                    <div className="w-8 h-1.5 bg-[#0E0E2C] rounded-full" />
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                  </div>
                </div>
                <div className="mb-10 max-w-4xl flex items-start justify-between border-b border-gray-100 pb-8">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="bg-[#3B41B1]/5 text-[#3B41B1] px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-[0.15em] border border-[#3B41B1]/10">
                        {product.category || "Lifestyle"}
                      </span>
                      <span className="text-gray-200">/</span>
                      <span className="text-gray-400 text-[10px] font-medium uppercase tracking-widest">
                        Ref: {product.id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <h1 className="text-4xl font-normal  text-gray-900 tracking-tight leading-tight max-w-xl">
                      {product.name}
                    </h1>
                  </div>
                  <div className="flex flex-col items-end gap-2 pl-8 border-l border-gray-50">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.2em] mb-4">
                        Current Price
                      </span>
                      <span className="text-3xl font-medium text-gray-900 tracking-tight whitespace-nowrap">
                        ₦ {product.price.toLocaleString()}
                      </span>
                    </div>
                    <Button
                      className="rounded-full px-8 h-12 bg-[#3B41B1] text-white hover:bg-[#3B41B1]/90 gap-3 font-medium text-sm shadow-lg transition-all hover:scale-105 active:scale-95 group shrink-0 mt-2"
                      onClick={() => handleAdd(product.id)}
                    >
                      Add to basket
                      <div className="bg-white/20 rounded-full p-1  transition-transform">
                        <Icon icon="ph:plus-bold" className="w-3.5 h-3.5" />
                      </div>
                    </Button>
                  </div>
                </div>

                <div className="mb-12 max-w-3xl">
                  <h3 className="text-2xl font-medium text-gray-900 mb-4 tracking-tight flex items-center gap-2">
                    <Icon icon="ph:info" className="text-[#3B41B1]" />
                    About this item
                  </h3>
                  <div className="prose prose-lg text-gray-600 leading-relaxed bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                    {product.description || "No description available."}
                  </div>
                </div>

                <div className="space-y-6 pb-12">
                  <h3 className="text-2xl font-medium text-gray-900 tracking-tight pl-4 border-l-4 border-[#3B41B1]">
                    More from {formattedProductName.split(" ")[0]}
                  </h3>
                  <MenuList
                    vendorId={product.vendorId}
                    addToBasket={handleAdd}
                    basket={basket}
                    products={relatedProducts}
                    isAuthenticated={isAuthenticated}
                    userId={userId || undefined}
                  />
                </div>
              </div>

              {/* Right Column: Gift Basket */}
              <div className="w-[380px] shrink-0">
                <div className="sticky top-[100px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                  <GiftBasket
                    basket={basket}
                    products={allProducts}
                    getBasketTotal={getBasketTotal}
                    setBasket={setBasket}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE: Original layout (unchanged) ── */}
      <div className="lg:hidden h-[100dvh] bg-gray-50 flex flex-col overflow-hidden">
        <div className="flex-1 bg-white flex flex-col overflow-hidden relative h-full">
          {/* Top Navigation */}
          <div className="shrink-0 flex items-center justify-between px-6 py-4 bg-white z-50 shadow-sm">
            <button
              onClick={handleBack}
              className="bg-[#949BB0] hover:bg-[#83899F] rounded-full px-4 py-2 flex items-center gap-2 text-white text-sm font-medium transition-all active:scale-95"
            >
              <Icon icon="ph:caret-left-bold" className="w-3.5 h-3.5" />
              Back
            </button>
            <h2 className="text-gray-900 font-medium text-xl tracking-tight truncate max-w-[200px]">
              {product.category || "Lifestyle"}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide pb-32">
            <ProductDetail />
            <div className="space-y-4 pt-4 pb-10">
              <h3 className="text-xl font-medium text-gray-900 pl-4">
                More from {formattedProductName.split(" ")[0]}
              </h3>
              <MobileMenuButtons
                vendorId={product.vendorId}
                addToBasket={handleAdd}
                basket={basket}
                setBasket={setBasket}
                products={relatedProducts}
                isAuthenticated={isAuthenticated}
                userId={userId || undefined}
              />
            </div>
          </div>

          {/* Sticky basket */}
          <div className="absolute bottom-0 left-0 right-0 z-50 bg-white">
            <GiftBasket
              basket={basket}
              products={allProducts}
              getBasketTotal={getBasketTotal}
              setBasket={setBasket}
            />
          </div>
        </div>
      </div>
    </>
  );
}
