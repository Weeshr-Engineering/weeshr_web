"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Product, ProductService } from "@/service/product.service";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import WidthLayout from "@/components/commons/width-layout";
import { MenuList } from "../../_components/menu-list";
import { BasketItem } from "@/lib/BasketItem";
import ChangeReceiverDialog from "../../_components/change-receiver-dialog";
import { GiftBasket } from "../../_components/gift-basket";

export default function VendorPage() {
  const { vendorName } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [receiverName, setReceiverName] = useState("");
  const [open, setOpen] = useState(false);
  const [basket, setBasket] = useState<BasketItem[]>([]); // Use shared interface
  const [products, setProducts] = useState<Product[]>([]);

  const nameParam = searchParams.get("name");
  const categoryId = searchParams.get("categoryId");
  const vendorId = searchParams.get("vendorId");

  // Fetch products when vendorId changes
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

  // Redirect if no name or vendorId
  useEffect(() => {
    if (!nameParam || !vendorId) {
      router.replace("/marketplace");
    }
  }, [nameParam, vendorId, router]);

  // Do not render anything if no name or vendorId
  if (!nameParam || !vendorId) {
    return null;
  }

  // Capitalize the name
  const displayName = nameParam.charAt(0).toUpperCase() + nameParam.slice(1);

  // Handle submit
  const handleSubmit = () => {
    if (receiverName.trim().length > 0) {
      router.push(
        `/marketplace/categories/food/${vendorName}?name=${encodeURIComponent(
          receiverName
        )}&categoryId=${categoryId}&vendorId=${vendorId}`
      );
      setOpen(false);
    }
  };

  function addToBasket(id: string) {
    setBasket((prev) => {
      const exists = prev.find((i) => i.id === id);
      if (exists) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [{ id, qty: 1 }, ...prev];
    });
  }

  // Calculate actual basket total based on product prices
  function getBasketTotal() {
    return basket.reduce((sum, basketItem) => {
      const product = products.find((p) => p.id === basketItem.id);
      return sum + (product?.price || 0) * basketItem.qty;
    }, 0);
  }

  return (
    <div className="flex flex-col ">
      <WidthLayout>
        {/* Breadcrumb */}
        <div className="text-left text-4xl p-6 flex items-center font-extralight text-gray-700">
          Food{" "}
          <span className="mx-1 font-bold">
            <Icon
              icon="teenyicons:right-outline"
              className="h-4 w-6 text-gray-500"
            />
          </span>{" "}
          <span className="capitalize font-normal ">{vendorName}</span>
        </div>

        {/* Receiver Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-6 mt-6">
          <div className="bg-white p-4 rounded-2xl text-[#6A70FF] font-light px-6 w-full col-span-2">
            <div className="pl-4">
              <ChangeReceiverDialog
                open={open}
                setOpen={setOpen}
                receiverName={receiverName}
                setReceiverName={setReceiverName}
                handleSubmit={handleSubmit}
              />

              <div>
                <span className="inline-block text-primary text-4xl">
                  What would{" "}
                  <span className="relative whitespace-nowrap text-blue-600 pr-1">
                    <span
                      className="relative whitespace-nowrap bg-gradient-custom bg-clip-text text-transparent text-2xl font-medium -ml-1.5"
                      style={{ fontFamily: "Playwrite CU, sans-serif" }}
                    >
                      {displayName}
                    </span>
                  </span>
                  <span className="inline-block pl-1">like?</span>
                </span>
              </div>
            </div>

            <div className="text-muted-foreground pl-4 pt-6">
              Restaurant Menu
            </div>
            <div className="md:max-h-[600px] max-h-96 overflow-y-auto mt-0 pr-2">
              <MenuList vendorId={vendorId} addToBasket={addToBasket} />
            </div>
          </div>

          <div className="mt-6 md:mt-0 ">
            <GiftBasket
              basket={basket}
              products={products}
              getBasketTotal={getBasketTotal}
              setBasket={setBasket}
            />
          </div>
        </div>
      </WidthLayout>
    </div>
  );
}
