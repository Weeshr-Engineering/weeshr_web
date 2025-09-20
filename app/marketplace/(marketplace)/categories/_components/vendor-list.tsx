"use client";

import { useState, useEffect } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { VendorCardSkeleton } from "./vendor-card-skeleton";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity";

interface Vendor {
  id: number;
  name: string;
  image: string;
  rating: number;
  category: string;
  badges: string[];
  giftIdeas: number;
}

interface VendorListProps {
  vendors: Vendor[];
}

const VendorList: React.FC<VendorListProps> = ({ vendors }) => {
  const [loading, setLoading] = useState(true);

  function sentenceCase(str?: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // skeleton for ~0.8s
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <VendorCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6">
        {vendors.map((vendor) => (
          <Card
            key={vendor.id}
            className="overflow-hidden rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-200 bg-white border-0"
          >
            {/* Image */}
            <div className="relative">
              <Image
                src={vendor.image}
                alt={vendor.name}
                width={400}
                height={240}
                className="w-full h-40 object-cover"
                loading="lazy"
                quality={75}
              />
              <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm rounded-2xl px-2 py-1 flex gap-1.5">
                <div className="w-3">
                  <Icon icon="famicons:fast-food-outline" />
                </div>
                <span className="text-primary text-sm font-light">
                  {vendor.category}
                </span>
              </div>
            </div>

            {/* Badges */}
            <div className="py-2 px-0">
              <ScrollVelocityContainer className="text-4xl md:text-7xl font-bold">
                <ScrollVelocityRow
                  baseVelocity={2}
                  direction={1}
                  className="text-muted-foreground text-sm px-0 whitespace-nowrap custom-scroll-text font-light"
                >
                  {vendor.badges.map((badge, index) =>
                    index < vendor.badges.length - 1 ? (
                      <span key={index}>
                        {badge} <span className="text-[#6A70FF] px-2">✱</span>{" "}
                      </span>
                    ) : (
                      <span key={index}>{badge}</span>
                    )
                  )}
                </ScrollVelocityRow>
              </ScrollVelocityContainer>
            </div>

            {/* Content */}
            <div className="p-4 bg-marketplace-foreground pt-2">
              <CardTitle className="text-lg font-normal text-gray-900 mb-4 capitalize">
                {sentenceCase(vendor?.name)}
              </CardTitle>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground text-sm">Gift Ideas</p>
                  <p className="text-sm text-primary font-semibold">
                    {vendor.giftIdeas}
                  </p>
                </div>

                <div className="flex">
                  <Button
                    variant={"ghost"}
                    className="px-2 py-2 text-muted-foreground hover:underline hover:decoration-text-foreground hover:bg-transparent transition-colors text-sm font-medium rounded-2xl"
                  >
                    Send
                  </Button>
                  <Button
                    size={"xl2"}
                    variant={"marketplace"}
                    className="transition-colors text-sm font-medium flex items-center gap-1 bg-marketplace-primary hover:bg-marketplace-primary/60"
                  >
                    <span>
                      <Icon icon="famicons:gift-sharp" height={14} width={14} />
                    </span>
                    Delivery
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VendorList;
