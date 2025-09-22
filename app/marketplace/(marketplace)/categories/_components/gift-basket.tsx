"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import EmptyBasket from "./empty-basket";
import { BasketItemCard } from "./basket-Item-card";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  img: string;
}

interface BasketItem {
  id: number;
  qty: number;
}

interface GiftBasketProps {
  basket: BasketItem[];
  menu: MenuItem[];
  getBasketTotal: () => number;
  setBasket: React.Dispatch<React.SetStateAction<BasketItem[]>>; // Add setBasket to props
}

export function GiftBasket({
  basket,
  menu,
  getBasketTotal,
  setBasket,
}: GiftBasketProps) {
  return (
    <div className="border-0 rounded-2xl bg-background ">
      <h3 className="font-normal pt-6 pb-2 w-full text-center">Gift basket</h3>
      <div className="min-h-[300px] p-4 ">
        {basket.length === 0 ? (
          <EmptyBasket />
        ) : (
          <div className="space-y-1 max-h-[360px] overflow-y-auto">
            {" "}
            {/* Replace ul with div for card layout */}
            <div className="flex justify-between px-1.5 text-xs items-center">
              <h5 className="text-sm">Dang!</h5>

              <Button
                variant="ghost"
                className="text-[#6A70FF] text-xs px-2 py-1 h-6 rounded-3xl"
                aria-label="Delete items from basket"
              >
                Delete
              </Button>
            </div>
            {basket.map((b) => (
              <BasketItemCard
                key={b.id}
                item={b}
                menu={menu}
                setBasket={setBasket}
              />
            ))}
          </div>
        )}
      </div>

      <div className="border-t-[1.5px] border-transparent [border-image:linear-gradient(to_right,#00E19D_0%,#6A70FF_36%,#00BBD4_66%,#AEE219_100%)_1] flex flex-row justify-between items-center px-4 py-3">
        <div>
          <h6 className="text-muted-foreground text-xs">Your basket</h6>₦{" "}
          {getBasketTotal().toLocaleString()}
        </div>
        <Button
          variant={"default"}
          disabled={basket.length === 0}
          className="disabled:opacity-50 rounded-3xl px-1.5 text-xs flex py-1 h-7 space-x-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-[#4145A7] hover:to-[#5a5fc7] focus:ring-2 focus:ring-[#4145A7] focus:ring-offset-2"
          aria-label={`Send basket with ${basket.length} items`}
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
      </div>
    </div>
  );
}
