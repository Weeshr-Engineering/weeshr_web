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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05, // Faster stagger for mobile feeling
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    }),
    hover: {
      y: -4,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    tap: {
      scale: 0.97,
      transition: { duration: 0.1 },
    },
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 py-6 transition-all">
        {vendors.map((vendor, index) => (
          <motion.div
            key={vendor.id}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            viewport={{ once: true, margin: "50px" }}
          >
            <Card
              className="group overflow-hidden rounded-3xl border border-gray-50 cursor-pointer bg-white transition-all duration-500
              shadow-[0_8px_20px_-4px_rgba(0,0,0,0.04)] 
              hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]
              active:shadow-[0_16px_24px_-12px_rgba(0,0,0,0.06)]"
              onClick={() =>
                goToVendor(vendor.category, vendor.name, vendor.id)
              }
            >
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-t-3xl bg-gray-50">
                {/* Shimmer skeleton while loading */}
                {!imageLoadedStates[vendor.id] && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 animate-shimmer z-10" />
                )}

                <div className="rounded-t-3xl overflow-hidden group relative">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: imageLoadedStates[vendor.id] ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                  >
                    <Image
                      src={vendor.image}
                      alt={vendor.name}
                      width={400}
                      height={240}
                      className="w-full h-48 object-cover transition-all duration-700 group-hover:saturate-[1.03] group-hover:brightness-[1.02]"
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
                  {/* Subtle Gradient Overlay for Depth */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-40" />
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md rounded-full px-3 py-1 flex gap-1.5 shadow-sm border border-gray-100/50 z-20">
                  <div className="w-3 flex items-center">
                    <Icon
                      icon={getCategoryIcon(vendor.category)}
                      className="text-gray-600"
                    />
                  </div>
                  <span className="text-gray-600 text-xs font-medium tracking-tight">
                    {vendor.category}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 bg-white rounded-b-3xl">
                <CardTitle className="text-base font-semibold text-gray-900 mb-3 capitalize tracking-tight">
                  {sentenceCase(vendor?.name)}
                </CardTitle>

                <div className="flex justify-between items-end gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-400 text-[11px] uppercase tracking-wider font-bold mb-1">
                      Gift Ideas
                    </p>
                    <p className="text-gray-600 text-sm line-clamp-1 font-medium">
                      {vendor.giftIdeas}
                    </p>
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
