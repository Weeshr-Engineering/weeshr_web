"use client";

import Image from "next/image";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState } from "react";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  img: string;
  description: string;
}

interface MenuListProps {
  menu: MenuItem[];
  addToBasket: (id: number) => void;
}

export function MenuList({ menu, addToBasket }: MenuListProps) {
  const [shakeId, setShakeId] = useState<number | null>(null);
  const [hoverId, setHoverId] = useState<number | null>(null);

  const handleAdd = (id: number) => {
    addToBasket(id);
    setShakeId(id);
    setTimeout(() => setShakeId(null), 500); // reset after shake
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 pt-2">
      {menu.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 bg-white border-[1px] flex flex-row min-w-[300px] p-2 gap-2"
        >
          {/* Image */}
          <div className="relative  w-[100px] h-[100px] flex-shrink-0">
            <Image
              src={item.img}
              alt={item.name}
              width={200}
              height={200}
              className="object-cover w-full h-full rounded-lg"
              loading="lazy"
              quality={75}
            />
          </div>

          {/* Content */}
          <div className=" flex flex-col justify-between flex-1 min-w-0">
            <div>
              <CardTitle className="text-sm font-normal">{item.name}</CardTitle>
              <CardDescription className="text-xs mb-2 text-muted-foreground">
                {item.description}
              </CardDescription>
            </div>

            <div className="flex justify-between items-center text-md">
              <p>₦ {item.price.toLocaleString()}</p>

              {/* Button stays still; we detect hover on it and animate icon only */}
              <Button
                size="sm"
                variant="marketplace"
                onClick={() => handleAdd(item.id)}
                onMouseEnter={() => setHoverId(item.id)}
                onMouseLeave={() => setHoverId(null)}
                className="rounded-3xl font-light text-xs gap-1 flex items-center py-0.5 h-7"
              >
                Add to basket
                {/* motion.span drives BOTH hover-zoom & click-shake smoothly */}
                <motion.span
                  initial={{ x: 0, scale: 1, rotate: 0 }}
                  animate={{
                    // shake (x) only when clicked
                    x: shakeId === item.id ? [-6, 6, -6, 6, 0] : 0,
                    // hover scale/rotate only when hovering parent button
                    scale: hoverId === item.id ? 1.18 : 1,
                    rotate: hoverId === item.id ? 8 : 0,
                  }}
                  transition={{
                    // separate transitions so scale/rotate feel snappy while shake uses its own timing
                    x:
                      shakeId === item.id
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
