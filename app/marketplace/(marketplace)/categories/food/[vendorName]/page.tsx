"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuList } from "../../_components/menu-list";
import { GiftBasket } from "../../_components/gift-basket";
import { menu_food } from "@/lib/constants/menu-items";
import WidthLayout from "@/components/commons/width-layout";
import { Icon } from "@iconify/react";
import ChangeReceiverDialog from "../../_components/change-receiver-dialog";

export default function VendorPage() {
  const { vendorName } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [receiverName, setReceiverName] = useState("");
  const [open, setOpen] = useState(false);

  const nameParam = searchParams.get("name");

  // Redirect if no name
  useEffect(() => {
    if (!nameParam) {
      router.replace("/marketplace");
    }
  }, [nameParam, router]);

  // Do not render anything if no name
  if (!nameParam) {
    return null;
  }

  // Capitalize the name
  const displayName = nameParam.charAt(0).toUpperCase() + nameParam.slice(1);

  // Handle submit
  const handleSubmit = () => {
    if (receiverName.trim().length > 0) {
      router.push(
        `/marketplace/categories/${vendorName}?name=${encodeURIComponent(
          receiverName
        )}`
      );
      setOpen(false); // Close dialog after submit
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [basket, setBasket] = useState<{ id: number; qty: number }[]>([]);

  function addToBasket(id: number) {
    setBasket((prev) => {
      const exists = prev.find((i) => i.id === id);
      if (exists) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [{ id, qty: 1 }, ...prev];
    });
  }

  function getBasketTotal() {
    return basket.reduce((sum, item) => {
      const product = menu_food.find((m) => m.id === item.id);
      return sum + (product?.price ?? 0) * item.qty;
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

        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6 mt-6">
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
              <MenuList menu={menu_food} addToBasket={addToBasket} />
            </div>
          </div>

          <div className="mt-6 md:mt-0 ">
            <GiftBasket
              basket={basket}
              menu={menu_food}
              getBasketTotal={getBasketTotal}
              setBasket={setBasket}
            />
          </div>
        </div>
      </WidthLayout>
    </div>
  );
}
