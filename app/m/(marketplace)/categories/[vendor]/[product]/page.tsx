"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Product, ProductService } from "@/service/product.service";
import { Vendor, VendorService } from "@/service/vendor.service";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";
import {
  useParams,
  useSearchParams,
  useRouter,
  usePathname,
} from "next/navigation";
import { useEffect, useState } from "react";
import { MenuList } from "../../_components/menu-list";
import { MobileMenuButtons } from "../../_components/mobile-menu-buttons";
import { BasketItem } from "@/lib/BasketItem";
import ChangeReceiverDialog from "../../_components/change-receiver-dialog";
import { GiftBasket } from "../../_components/gift-basket";
import axios from "axios";
import { cartService } from "@/service/cart.service";
import toast from "react-hot-toast";

// Define category labels for vendor pages
const vendorCategoryLabels: Record<string, string> = {
  food: "Restaurant Menu",
  fashion: "Fashion Collection",
  gadgets: "Gadget Collection",
  lifestyle: "Lifestyle Collection",
  default: "Product Menu",
};

export default function VendorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [receiverName, setReceiverName] = useState("");
  const [open, setOpen] = useState(false);
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [showAiSoon, setShowAiSoon] = useState(false);
  const [randomBanner, setRandomBanner] = useState<string | null>(null);
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const nameParam = searchParams.get("name");
  const categoryId = searchParams.get("categoryId");
  const vendorId = searchParams.get("vendorId");

  // Extract category and vendor from URL path
  const segments = pathname.split("/").filter(Boolean);
  const categoryName = segments[2] || "default";
  const vendorName = segments[3] || "";

  // Derived effective category info for breadcrumb/navigation
  const firstProduct = products[0];
  const effectiveCategoryName =
    categoryName === "undefined" || !categoryName
      ? firstProduct?.category?.toLowerCase() || (loading ? "" : "food")
      : categoryName.toLowerCase();

  const effectiveCategoryId =
    !categoryId || categoryId === "null"
      ? firstProduct?.categoryId || ""
      : categoryId;

  // Get display label for the category
  const categoryLabel =
    vendorCategoryLabels[effectiveCategoryName] || vendorCategoryLabels.default;

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        try {
          const profileResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            },
          );

          if (
            profileResponse.status === 200 ||
            profileResponse.status === 201
          ) {
            setIsAuthenticated(true);
            setUserId(profileResponse.data.data._id);
          } else {
            setIsAuthenticated(false);
            setUserId(null);
          }
        } catch (error) {
          setIsAuthenticated(false);
          setUserId(null);
        }
      } else {
        setIsAuthenticated(false);
        setUserId(null);
      }
    };

    checkAuth();
  }, []);

  // Sync basket with server cart on mount
  useEffect(() => {
    const syncCart = async () => {
      if (isAuthenticated && userId) {
        try {
          const response = await cartService.getUserCart(userId);
          if (response.code === 200 && response.data?.items) {
            const items = response.data.items.map((item: any) => ({
              id: item.productId,
              qty: item.quantity,
            }));
            setBasket(items);
          }
        } catch (error) {
          console.error("Cart sync error:", error);
        }
      }
    };
    syncCart();
  }, [isAuthenticated, userId]);

  // Fetch products and vendor details
  useEffect(() => {
    const fetchData = async () => {
      if (!vendorId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);

        // Fetch vendor and products in parallel, but handle them as they arrive
        const vendorPromise = VendorService.getVendorById(vendorId).then(
          (data) => {
            setVendor(data);
            return data;
          },
        );

        const productsPromise = ProductService.getProductsByVendor(
          vendorId,
        ).then((response) => {
          setProducts(response.products);
          return response;
        });

        const [vendorData, productsResponse] = await Promise.all([
          vendorPromise,
          productsPromise,
        ]);

        const products = productsResponse.products;

        // Randomize banner if vendor has no image
        if (!vendorData?.image && products.length > 0) {
          const randomIndex = Math.floor(Math.random() * products.length);
          setRandomBanner(products[randomIndex].image);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vendorId]);

  // Redirect if missing required parameters
  useEffect(() => {
    if (!nameParam || !vendorId) {
      router.replace("/m");
    }
  }, [nameParam, vendorId, router]);

  if (!nameParam || !vendorId) {
    return null;
  }

  const displayName =
    nameParam.charAt(0).toUpperCase() + nameParam.slice(1).toLowerCase();

  const handleSubmit = () => {
    if (receiverName.trim().length > 0) {
      router.push(
        `/m/categories/${categoryName}/${vendorName}?name=${encodeURIComponent(
          receiverName,
        )}&categoryId=${categoryId}&vendorId=${vendorId}`,
      );
      setOpen(false);
    }
  };

  // Add item to basket
  const addToBasket = (id: string) => {
    setBasket((prev) => {
      const exists = prev.find((i) => i.id === id);
      if (exists) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [{ id, qty: 1 }, ...prev];
    });
  };

  // Calculate basket total
  const getBasketTotal = () =>
    basket.reduce((sum, basketItem) => {
      const product = products.find((p) => p.id === basketItem.id);
      return sum + (product?.price || 0) * basketItem.qty;
    }, 0);

  const handleCategoryClick = () => {
    router.push(
      `/m/categories/${effectiveCategoryName}?id=${effectiveCategoryId}&name=${encodeURIComponent(
        nameParam,
      )}`,
    );
  };

  // Clear basket function with API sync
  const clearBasket = async () => {
    // Store current basket for potential rollback
    const previousBasket = [...basket];

    // Clear UI immediately
    setBasket([]);

    // Sync with API in background if authenticated
    if (isAuthenticated && userId) {
      try {
        const cartId = cartService.getCurrentCartId();
        if (cartId) {
          const result = await cartService.clearCart(cartId);
          if (!(result.code === 200 || result.code === 201)) {
            toast.error("Failed to clear cart on server");
            // Optional: Revert local state if API fails
            // setBasket(previousBasket);
          } else {
            toast.success("Cart cleared successfully");
          }
        }
      } catch (error) {
        toast.error("Failed to clear cart on server");
        console.error("Clear cart error:", error);
        // Optional: Revert local state if API fails
        // setBasket(previousBasket);
      }
    } else {
      // For guest users, just show success immediately
      toast.success("Cart cleared successfully");
    }
  };

  // Total available products from vendor
  const totalAvailable = products.length;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Banner Section - Ultra immersive and short */}
      <section className="relative w-full md:w-[90%] md:mx-auto md:rounded-[3rem] md:mt-8 aspect-[5/2] md:aspect-[21/6] overflow-hidden shadow-lg">
        {/* Banner Source Resolution */}
        {(() => {
          const bannerSrc = randomBanner || products[0]?.image;

          return (
            <>
              {(!bannerSrc || (loading && !bannerLoaded)) && (
                <Skeleton className="absolute inset-0 w-full h-full z-0" />
              )}

              {bannerSrc && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={bannerSrc}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: bannerLoaded ? 1 : 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative w-full h-full"
                  >
                    <motion.img
                      src={bannerSrc}
                      alt="Vendor Banner"
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.1, filter: "blur(4px)" }}
                      animate={
                        bannerLoaded ? { scale: 1, filter: "blur(0px)" } : {}
                      }
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      onLoad={() => setBannerLoaded(true)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent z-10" />
                  </motion.div>
                </AnimatePresence>
              )}
            </>
          );
        })()}

        {/* Floating Controls - High-end Glassmorphism */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-all active:scale-95 shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
          >
            <Icon icon="ph:caret-left-bold" width="18" />
            <span className="text-sm font-semibold tracking-wide">Back</span>
          </button>

          <div className="flex items-center gap-2">
            <motion.div
              initial={false}
              animate={{
                width: isSearching
                  ? window.innerWidth < 768
                    ? "160px"
                    : "240px"
                  : "0px",
                opacity: isSearching ? 1 : 0,
                marginRight: isSearching ? "8px" : "0px",
              }}
              className="overflow-hidden"
            >
              <input
                autoFocus
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full py-2.5 px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 placeholder:text-white/50"
              />
            </motion.div>

            <button
              onClick={() => {
                setIsSearching(!isSearching);
                if (isSearching) setSearchQuery("");
              }}
              className="w-11 h-11 flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-all active:scale-95 shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
            >
              <Icon
                icon={isSearching ? "ph:x-bold" : "ph:magnifying-glass-bold"}
                width="22"
              />
            </button>
          </div>
        </div>
      </section>

      {/* Vendor Indigo Header Bar - Luxurious Overlap */}
      <section className="bg-[#3B41B1] px-8 py-6 pt-4 pb-[3.5rem] flex items-center justify-between shadow-2xl sticky top-0 z-30 rounded-t-[2rem] -mt-14 md:-mt-16 border-t border-white/5">
        <div className="flex flex-col">
          <h2 className="text-white font-medium text-xl md:text-3xl tracking-tight leading-none">
            {vendorName
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </h2>
        </div>

        <motion.div
          whileTap={{ scale: 0.95 }}
          className="bg-white rounded-full px-3 py-1 flex items-center gap-2 shadow-[0_8px_20px_rgba(255,255,255,0.15)] cursor-pointer border border-white/40"
        >
          <Icon icon="solar:bag-bold" className="text-slate-950 w-5 h-5" />
          <span className="text-slate-950 font-bold text-sm">
            {!loading && totalAvailable}
          </span>
        </motion.div>
      </section>

      <div className="flex-1 flex flex-col bg-white rounded-t-[1rem] -mt-10 relative z-40 shadow-[0_-15px_50px_rgba(0,0,0,0.08)]">
        {/* Main Content Area */}
        <div className="px-0 md:px-6 w-full max-w-7xl mx-auto flex-1">
          {/* Main question section - Elegant & Center Focused */}
          <div className="px-6 flex flex-col items-start">
            <div className="flex flex-row items-end justify-between w-full max-w-3xl mx-auto gap-4 py-3">
              <span className="text-[#1F2937] text-2xl md:text-6xl leading-tight font-light tracking-tight text-left">
                What would{" "}
                <span className="relative inline-flex items-center gap-2 overflow-visible">
                  <span
                    className="relative z-10 bg-gradient-custom inline-flex items-center justify-center bg-clip-text text-transparent italic font-medium whitespace-nowrap"
                    style={{
                      fontFamily:
                        "var(--font-playwrite), 'Playwrite CU', cursive, sans-serif",
                      height: "56px",
                      width: `${Math.max(80, (displayName?.length || 0) * 20)}px`,
                    }}
                  >
                    {displayName}
                  </span>
                </span>{" "}
                like ? 🥳
              </span>

              {/* AI Assistant Button - Integrated next to question */}
              <div className="relative group">
                <button
                  onClick={() => {
                    setShowAiSoon(true);
                    setTimeout(() => setShowAiSoon(false), 2000);
                  }}
                  className={cn(
                    "flex-shrink-0 bg-white text-[#6A70FF] h-10 flex items-center justify-center rounded-full transition-all duration-300 ease-out focus:outline-none shadow-sm hover:shadow-md px-2 border border-[#6A70FF]/10",
                    showAiSoon ? "w-max px-3" : "w-10",
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <AnimatePresence mode="wait">
                      {showAiSoon && (
                        <motion.span
                          key="soon-text"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap px-1"
                        >
                          Ai soon
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <Icon
                      icon="humbleicons:ai"
                      width="18"
                      height="18"
                      className="w-5 h-5 transition-all duration-300 ease-in-out group-hover:rotate-12 group-hover:scale-110"
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="md:max-h-[800px] overflow-y-auto">
                <div className="lg:hidden">
                  <MobileMenuButtons
                    vendorId={vendorId}
                    addToBasket={addToBasket}
                    basket={basket}
                    setBasket={setBasket}
                    products={products}
                    isAuthenticated={isAuthenticated}
                    userId={userId || undefined}
                    clearBasket={clearBasket}
                    onOpenChangeReceiver={() => setOpen(true)}
                    searchQuery={searchQuery}
                    vendorName={vendor?.name}
                  />
                </div>

                <div className="hidden lg:block">
                  <MenuList
                    vendorId={vendorId}
                    addToBasket={addToBasket}
                    basket={basket}
                    products={products}
                    isAuthenticated={isAuthenticated}
                    userId={userId || undefined}
                    clearBasket={clearBasket}
                    onOpenChangeReceiver={() => setOpen(true)}
                    searchQuery={searchQuery}
                    vendorName={vendor?.name}
                  />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80 shrink-0">
              <GiftBasket
                basket={basket}
                products={products}
                getBasketTotal={getBasketTotal}
                setBasket={setBasket}
              />
            </div>
          </div>
        </div>
      </div>
      <ChangeReceiverDialog
        open={open}
        setOpen={setOpen}
        receiverName={receiverName}
        setReceiverName={setReceiverName}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
