"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Product, ProductService } from "@/service/product.service";

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

// Define category labels for vendor pages
const vendorCategoryLabels: Record<string, string> = {
  food: "Restaurant Menu",
  fashion: "Fashion Collection",
  gadget: "Gadget Collection",
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

  const nameParam = searchParams.get("name");
  const categoryId = searchParams.get("categoryId");
  const vendorId = searchParams.get("vendorId");

  // Extract category and vendor from URL path
  const segments = pathname.split("/").filter(Boolean);
  const categoryName = segments[2] || "default";
  const vendorName = segments[3] || "";

  // Get display label for the category
  const categoryLabel =
    vendorCategoryLabels[categoryName as string] ||
    vendorCategoryLabels.default;

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
            }
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

  // Fetch products for selected vendor
  useEffect(() => {
    const fetchProducts = async () => {
      if (!vendorId) return;
      try {
        const productsData = await ProductService.getProductsByVendor(vendorId);
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [vendorId]);

  // Redirect if missing required parameters
  useEffect(() => {
    if (!nameParam || !vendorId) {
      router.replace("/marketplace");
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
        `/marketplace/categories/${categoryName}/${vendorName}?name=${encodeURIComponent(
          receiverName
        )}&categoryId=${categoryId}&vendorId=${vendorId}`
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
      `/marketplace/categories/${categoryName}?id=${categoryId}&name=${encodeURIComponent(
        nameParam
      )}`
    );
  };

  return (
    <div className="flex flex-col">
      {/* Breadcrumb - MOBILE SIZE ADJUSTED */}
      <div className="text-left text-xl md:text-4xl p-4 md:p-6 flex items-center font-extralight text-gray-700">
        <button
          onClick={handleCategoryClick}
          className="capitalize hover:text-blue-600 transition-colors cursor-pointer"
        >
          {categoryName}
        </button>
        <span className="mx-1 font-bold">
          <Icon
            icon="teenyicons:right-outline"
            className="h-4 w-6 text-gray-500"
          />
        </span>
        <span className="capitalize font-normal">
          {vendorName.replace(/-/g, " ")}
        </span>
      </div>

      {/* Receiver Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-6  lg:pb-0">
        <div className="bg-white p-4 rounded-2xl text-[#6A70FF] font-light px-2 md:px-6 w-full col-span-2">
          <div className="pl-4">
            <ChangeReceiverDialog
              open={open}
              setOpen={setOpen}
              receiverName={receiverName}
              setReceiverName={setReceiverName}
              handleSubmit={handleSubmit}
            />

            {/* Main question - MOBILE SIZE ADJUSTED */}
            <div>
              <span className="inline-block text-primary text-xl md:text-4xl leading-snug">
                What would{" "}
                <span className="relative whitespace-nowrap text-blue-600 pr-1">
                  <span
                    className="relative whitespace-nowrap bg-gradient-custom bg-clip-text text-transparent text-lg md:text-2xl font-medium -ml-1.5"
                    style={{ fontFamily: "Playwrite CU, sans-serif" }}
                  >
                    {displayName}
                  </span>
                </span>
                <span className="inline-block pl-1">like?</span>
              </span>
            </div>
          </div>

          {/* Dynamic label based on category - MOBILE SIZE ADJUSTED */}
          <div className="text-muted-foreground pl-4 pt-4 text-sm md:text-base">
            {categoryLabel}
          </div>

          <div className="md:max-h-[600px] md:max-h-96 overflow-y-auto mt-0  md:pr-2">
            {/* Mobile version with quantity buttons */}
            <div className="md:hidden">
              <MobileMenuButtons
                vendorId={vendorId}
                addToBasket={addToBasket}
                basket={basket}
                setBasket={setBasket}
                products={products}
                isAuthenticated={isAuthenticated}
                userId={userId || undefined}
              />
            </div>

            {/* Desktop version with add to basket button */}
            <div className="hidden md:block">
              <MenuList
                vendorId={vendorId}
                addToBasket={addToBasket}
                basket={basket}
                products={products}
                isAuthenticated={isAuthenticated}
                userId={userId || undefined}
              />
            </div>
          </div>
        </div>

        <div className="md:mt-0 ">
          <GiftBasket
            basket={basket}
            products={products}
            getBasketTotal={getBasketTotal}
            setBasket={setBasket}
          />
        </div>
      </div>
    </div>
  );
}
