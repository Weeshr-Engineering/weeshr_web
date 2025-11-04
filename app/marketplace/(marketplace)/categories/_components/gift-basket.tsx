"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import EmptyBasket from "./empty-basket";
import { BasketItemCard } from "./basket-Item-card";
import { Product } from "@/service/product.service";
import { BasketItem } from "@/lib/BasketItem";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import LoginDialog from "./LoginDialog";
import { useState } from "react";

interface GiftBasketProps {
  basket: BasketItem[];
  products: Product[];
  getBasketTotal: () => number;
  setBasket: React.Dispatch<React.SetStateAction<BasketItem[]>>;
}

export function GiftBasket({
  basket,
  products,
  getBasketTotal,
  setBasket,
}: GiftBasketProps) {
  const [loginOpen, setLoginOpen] = useState(false);

  // Clear all items from basket
  const clearBasket = () => {
    setBasket([]);
  };

  return (
    <>
      <div className="border-0 rounded-2xl bg-background ">
        <h3 className="font-normal pt-6 pb-2 w-full text-center">
          Gift basket
        </h3>
        <div className="min-h-[450px] p-4 ">
          {basket.length === 0 ? (
            <EmptyBasket />
          ) : (
            <div className="space-y-1 max-h-[420px] overflow-y-auto">
              <div className="flex justify-between px-1.5 text-xs items-center">
                <h5 className="text-sm">Your Items</h5>

                <Button
                  variant="ghost"
                  className="text-[#6A70FF] text-xs px-2 py-1 h-6 rounded-3xl"
                  aria-label="Delete all items from basket"
                  onClick={clearBasket}
                >
                  Clear All
                </Button>
              </div>
              {basket.map((b) => (
                <BasketItemCard
                  key={b.id}
                  item={b}
                  products={products}
                  setBasket={setBasket}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-t-[1.5px] border-transparent [border-image:linear-gradient(to_right,#00E19D_0%,#6A70FF_36%,#00BBD4_66%,#AEE219_100%)_1] flex flex-row justify-between items-center px-4 py-3">
          <div>
            <h6 className="text-muted-foreground text-xs">Your basket</h6>
            <span className="font-semibold">
              ₦ {getBasketTotal().toLocaleString()}
            </span>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant={"default"}
                disabled={basket.length === 0}
                className="disabled:opacity-50 rounded-3xl px-1.5 text-xs flex py-1 h-7 space-x-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-[#4145A7] hover:to-[#5a5fc7] focus:ring-2 focus:ring-[#4145A7] focus:ring-offset-2"
                aria-label={`Send basket with ${basket.length} items`}
                onClick={() => setLoginOpen(true)}
              >
                <Badge
                  className="rounded-full bg-[#4145A7] p-0.5 text-sm w-5 h-5 flex justify-center transition-transform duration-200 hover:scale-110"
                  title={`${basket.length} items in basket`}
                >
                  {basket.length}
                </Badge>
                <span className="font-medium">Send basket</span>
                <Icon
                  icon="streamline-ultimate:shopping-basket-1"
                  className="text-white font-bold h-4 w-4"
                />
              </Button>
            </AlertDialogTrigger>
          </AlertDialog>
        </div>
      </div>

      <LoginDialog open={loginOpen} setOpen={setLoginOpen} />
    </>
  );
}
