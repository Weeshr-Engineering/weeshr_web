"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";
import { VendorCardSkeleton } from "./vendor-card-skeleton";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity";

// --- Types ---
interface CategoryData {
  _id: string;
  name: string;
  description: string;
  image?: {
    secure_url?: string;
  };
}

// --- Static fallback data ---
const staticFallback = {
  name: "Default Fashion Category",
  description: "A selection of our finest styles and accessories.",
  image:
    "https://img.freepik.com/free-photo/wardrobe-with-clothes-hangers_23-2148458983.jpg?w=1480",
  badges: ["Shoes", "Bags", "Dresses", "Accessories", "Jewelry"],
  giftIdeas: 12,
};

export default function CategoryDisplayList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const nameParam = searchParams.get("name");

  const [category, setCategory] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch category data
  useEffect(() => {
    async function fetchCategory() {
      if (!id) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${id}`
        );
        const json = await res.json();
        if (json?.code === 200 && json?.data) {
          setCategory(json.data);
        } else {
          console.warn("Fallback: Using static data");
          setCategory(null);
        }
      } catch (err) {
        console.error("Error fetching category:", err);
        setCategory(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCategory();
  }, [id]);

  function sentenceCase(str?: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <VendorCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const categoryData = category
    ? {
        name: category.name,
        description: category.description,
        image: category.image?.secure_url || staticFallback.image,
        badges: staticFallback.badges,
        giftIdeas: staticFallback.giftIdeas,
      }
    : staticFallback;

  return (
    <div className="py-6">
      <Card className="overflow-hidden rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-200 bg-white border-0">
        {/* Image */}
        <div className="relative">
          <Image
            src={categoryData.image}
            alt={categoryData.name}
            width={400}
            height={240}
            className="w-full h-60 object-cover"
            loading="lazy"
            quality={75}
          />
          <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm rounded-2xl px-2 py-1 flex gap-1.5">
            <Icon icon="mdi:wardrobe-outline" />
            <span className="text-primary text-sm font-light">
              Fashion Category
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
              {categoryData.badges.map((badge, index) =>
                index < categoryData.badges.length - 1 ? (
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
            {sentenceCase(categoryData.name)}
          </CardTitle>

          <p className="text-muted-foreground text-sm mb-4">
            {categoryData.description}
          </p>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-muted-foreground text-sm">Gift Ideas</p>
              <p className="text-sm text-primary font-semibold">
                {categoryData.giftIdeas}
              </p>
            </div>

            <div className="flex">
              <Button
                size="xl2"
                variant="marketplace"
                onClick={() =>
                  router.push(`/marketplace/categories/${id}?name=${nameParam}`)
                }
                className="transition-colors text-sm font-medium flex items-center gap-1 bg-marketplace-primary hover:bg-marketplace-primary/60"
              >
                <Icon icon="famicons:gift-sharp" height={14} width={14} />
                Explore Gifts
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
