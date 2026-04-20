"use client";

import React from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Image from "next/image";
import { VendorCardSkeleton } from "./vendor-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

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

  // Generate random starting offsets for each vendor once per mount
  const [randomOffsets] = React.useState<Record<string, number>>({});

  // Initialize random offsets for vendors that have multiple images
  React.useMemo(() => {
    vendors.forEach((vendor) => {
      if (vendor.productImages.length > 1 && !randomOffsets[vendor.id]) {
        randomOffsets[vendor.id] = Math.floor(
          Math.random() * vendor.productImages.length,
        );
      }
    });
  }, [vendors, randomOffsets]);

  // helper to slugify vendor names
  function slugify(str: string) {
    return str.toLowerCase().replace(/\s+/g, "-");
  }

  function goToVendor(
    vendorCategory: string,
    vendorName: string,
    vendorId: string,
  ) {
    const slug = slugify(vendorName);
    const cat = vendorCategory.toLowerCase();
    router.push(
      `/m/categories/${cat}/${slug}?name=${nameParam}&categoryId=${categoryId}&vendorId=${vendorId}`,
    );
  }

  function sentenceCase(str?: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  if (loading) {
    return (
      <div className="space-y-px sm:space-y-3">
        <div className="grid grid-cols-3 sm:gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <VendorCardSkeleton key={i} />
          ))}
        </div>
        <Skeleton className="w-full aspect-[4/3] sm:rounded-3xl" />
        <div className="grid grid-cols-3 sm:gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <VendorCardSkeleton key={`more-${i}`} />
          ))}
        </div>
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
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.03,
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      },
    }),
  };

  // Build the layout: 6 regular cards followed by 1 featured card sequentially
  const FEATURED_INTERVAL = 6;
  const items: Array<
    | { type: "regular"; vendors: Vendor[]; startIndex: number }
    | { type: "featured"; vendor: Vendor; index: number }
  > = [];

  let i = 0;
  while (i < vendors.length) {
    // Collect up to 6 regular cards
    const groupEnd = Math.min(i + FEATURED_INTERVAL, vendors.length);
    const group = vendors.slice(i, groupEnd);
    items.push({ type: "regular", vendors: group, startIndex: i });
    i = groupEnd;

    // The next card is a featured one, if we have vendors left
    if (i < vendors.length) {
      items.push({ type: "featured", vendor: vendors[i], index: i });
      i++;
    }
  }

  return (
    <div className="space-y-px sm:space-y-3">
      {items.map((item, blockIndex) => {
        if (item.type === "featured") {
          const vendor = item.vendor;
          const offset = randomOffsets[vendor.id] || 0;
          const currentImage =
            vendor.productImages.length > 0
              ? vendor.productImages[offset % vendor.productImages.length]
              : vendor.image;
          const isLoaded = imageLoadedStates[currentImage];

          return (
            <motion.div
              key={`featured-${vendor.id}`}
              custom={item.index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="w-full cursor-pointer"
              onClick={() =>
                goToVendor(vendor.category, vendor.name, vendor.id)
              }
            >
              <div className="relative overflow-hidden sm:rounded-3xl bg-gray-100">
                {/* Featured image — taller */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  {!isLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer z-10" />
                  )}
                  <Image
                    src={currentImage}
                    alt={vendor.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                    loading="lazy"
                    sizes="100vw"
                    quality={80}
                    onLoad={() =>
                      setImageLoadedStates((prev) => ({
                        ...prev,
                        [currentImage]: true,
                      }))
                    }
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjNGNEY2Ii8+PC9zdmc+";
                      setImageLoadedStates((prev) => ({
                        ...prev,
                        [currentImage]: true,
                      }));
                    }}
                  />

                  {/* Gradient overlay for text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Category badge - top right */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 z-20">
                    <span className="text-gray-700 text-xs font-medium">
                      {vendor.category}
                    </span>
                  </div>

                  {/* Vendor name overlay - bottom left */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <p className="text-white text-xl sm:text-2xl font-medium sm:font-bold tracking-tight drop-shadow-lg">
                      {sentenceCase(vendor?.name)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        }

        // Regular 3-column grid
        return (
          <div
            key={`grid-${blockIndex}`}
            className="grid grid-cols-3  sm:gap-3"
          >
            {item.vendors.map((vendor, idx) => {
              const globalIndex = item.startIndex + idx;
              const offset = randomOffsets[vendor.id] || 0;
              const currentImage =
                vendor.productImages.length > 0
                  ? vendor.productImages[offset % vendor.productImages.length]
                  : vendor.image;
              const isLoaded = imageLoadedStates[currentImage];

              return (
                <motion.div
                  key={vendor.id}
                  custom={globalIndex}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="cursor-pointer"
                  onClick={() =>
                    goToVendor(vendor.category, vendor.name, vendor.id)
                  }
                >
                  <div className="relative overflow-hidden sm:rounded-2xl bg-gray-100 aspect-square">
                    {!isLoaded && (
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer z-10" />
                    )}
                    <Image
                      src={currentImage}
                      alt={vendor.name}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                      sizes="(max-width: 768px) 33vw, 25vw"
                      quality={70}
                      onLoad={() =>
                        setImageLoadedStates((prev) => ({
                          ...prev,
                          [currentImage]: true,
                        }))
                      }
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjNGNEY2Ii8+PC9zdmc+";
                        setImageLoadedStates((prev) => ({
                          ...prev,
                          [currentImage]: true,
                        }));
                      }}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />

                    {/* Category badge - top right */}
                    <div className="absolute top-2 right-2 z-20">
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-700 bg-white/85 backdrop-blur-sm rounded-full px-2 py-0.5 whitespace-nowrap">
                        {vendor.category}
                      </span>
                    </div>

                    {/* Vendor name - bottom left */}
                    <p className="absolute bottom-2 left-2 right-2 text-white text-[11px] sm:text-sm font-medium sm:font-bold truncate z-20 drop-shadow-md">
                      {sentenceCase(vendor?.name)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default VendorList;
