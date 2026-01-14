"use client";

import React from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { VendorCardSkeleton } from "./vendor-card-skeleton";

import { Vendor } from "@/service/vendor.service";
import { motion } from "framer-motion";

interface VendorListProps {
  vendors: Vendor[];
  loading?: boolean;
}

const VendorList: React.FC<VendorListProps> = ({
  vendors,
  loading = false,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const nameParam = searchParams.get("name");
  const categoryId = searchParams.get("id");

  // Track image loading state for each vendor
  const [imageLoadedStates, setImageLoadedStates] = React.useState<
    Record<string, boolean>
  >({});

  // helper to slugify vendor names
  function slugify(str: string) {
    return str.toLowerCase().replace(/\s+/g, "-");
  }

  function goToVendor(
    vendorCategory: string,
    vendorName: string,
    vendorId: string
  ) {
    const slug = slugify(vendorName);
    const cat = vendorCategory.toLowerCase();
    router.push(
      `/m/categories/${cat}/${slug}?name=${nameParam}&categoryId=${categoryId}&vendorId=${vendorId}`
    );
  }

  function getCategoryIcon(category: string) {
    const cat = category.toLowerCase();
    if (cat.includes("food")) return "famicons:fast-food-outline";
    if (cat.includes("fashion")) return "lucide:handbag";
    if (cat.includes("gadget") || cat.includes("phone"))
      return "lucide:smartphone";
    if (cat.includes("lifestyle")) return "lucide:sparkles";
    if (cat.includes("beauty") || cat.includes("health")) return "lucide:heart";
    if (cat.includes("grocer")) return "lucide:shopping-basket";
    return "lucide:store";
  }

  function sentenceCase(str?: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const getFallbackImageUrl = (vendorName: string) => {
    const foodPlaceholders = ["🍕", "🍔", "🍣", "🍜", "🌮", "🍝", "🍛", "🥗"];
    const randomEmoji =
      foodPlaceholders[Math.floor(Math.random() * foodPlaceholders.length)];
    return `/api/placeholder/400/240?text=${encodeURIComponent(
      vendorName
    )}&emoji=${randomEmoji}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <VendorCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (vendors.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No Vendor Found For This Category.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
        {vendors.map((vendor, index) => (
          <motion.div
            key={vendor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            // ❌ REMOVED card scale hover
          >
            <Card
              className="overflow-hidden rounded-3xl shadow-sm transition-shadow duration-200 bg-white border-0 cursor-pointer hover:shadow-md" // ✅ Only shadow change on hover
              onClick={() =>
                goToVendor(vendor.category, vendor.name, vendor.id)
              }
            >
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-t-3xl bg-gray-100">
                {/* Shimmer skeleton while loading */}
                {!imageLoadedStates[vendor.id] && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer" />
                )}

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-t-3xl overflow-hidden"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{
                      opacity: imageLoadedStates[vendor.id] ? 1 : 0,
                      scale: imageLoadedStates[vendor.id] ? 1 : 1.1,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.25, 0.1, 0.25, 1], // Custom easing for smooth fade
                    }}
                  >
                    <Image
                      src={vendor.image}
                      alt={vendor.name}
                      width={400}
                      height={240}
                      className="w-full h-36 object-cover"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={75}
                      onLoad={() => {
                        setImageLoadedStates((prev) => ({
                          ...prev,
                          [vendor.id]: true,
                        }));
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getFallbackImageUrl(vendor.name);
                        setImageLoadedStates((prev) => ({
                          ...prev,
                          [vendor.id]: true,
                        }));
                      }}
                    />
                  </motion.div>
                </motion.div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm rounded-2xl px-2 py-1 flex gap-1.5">
                  <div className="w-3">
                    <Icon icon={getCategoryIcon(vendor.category)} />
                  </div>
                  <span className="text-primary text-sm font-light">
                    {vendor.category}
                  </span>
                </div>

                {/* Product Count Badge */}
              </div>

              {/* Badges Section */}
              {/* {vendor.badges.length > 0 && (
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
                            {badge}{" "}
                            <span className="text-[#6A70FF] px-2">✱</span>{" "}
                          </span>
                        ) : (
                          <span key={index}>{badge}</span>
                        )
                      )}
                    </ScrollVelocityRow>
                  </ScrollVelocityContainer>
                </div>
              )} */}

              {/* Content Section */}
              <div className="p-4 bg-marketplace-foreground rounded-b-3xl">
                <CardTitle className="text-lg font-normal text-gray-900 mb-4 capitalize">
                  {sentenceCase(vendor?.name)}
                </CardTitle>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-muted-foreground text-sm">Gift Ideas</p>
                    {vendor.giftIdeas}
                  </div>

                  <div className="flex gap-1">
                    <motion.div
                      whileHover={{ scale: 1.05 }} // ✅ Button hover only
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          goToVendor(vendor.category, vendor.name, vendor.id);
                        }}
                        className="px-2 py-2 text-muted-foreground hover:underline hover:decoration-text-foreground hover:bg-transparent transition-colors text-sm font-medium rounded-2xl"
                      >
                        Send
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }} // ✅ Button hover only
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="xl2"
                        variant="marketplace"
                        onClick={(e) => {
                          e.stopPropagation();
                          goToVendor(vendor.category, vendor.name, vendor.id);
                        }}
                        className="transition-colors text-sm font-medium flex items-center gap-1 bg-marketplace-primary hover:bg-marketplace-primary/60 rounded-2xl"
                      >
                        <motion.span
                          whileHover={{ rotate: 15 }} // ✅ Icon hover only
                          transition={{ duration: 0.2 }}
                        >
                          <Icon
                            icon="famicons:gift-sharp"
                            height={14}
                            width={14}
                          />
                        </motion.span>
                        Delivery
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VendorList;
