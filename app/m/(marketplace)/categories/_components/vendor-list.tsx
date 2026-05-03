"use client";

import React from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Image from "next/image";
import { VendorCardSkeleton } from "./vendor-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

import { Vendor } from "@/service/vendor.service";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

  // Dynamic interval for featured items
  const [featuredInterval, setFeaturedInterval] = React.useState(9); // Default to mobile

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setFeaturedInterval(10); // lg and above
      } else if (window.innerWidth >= 768) {
        setFeaturedInterval(8); // md
      } else {
        setFeaturedInterval(9); // mobile
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[1px]">
        {Array.from({ length: 20 }).map((_, i) => {
          const isFeatured = (i + 1) % (featuredInterval + 1) === 0;
          let spanClass = "col-span-1 row-span-1 aspect-square";
          if (isFeatured) {
            const cycle = Math.floor(i / (featuredInterval + 1)) % 3;
            if (cycle === 0) spanClass = "col-span-3 aspect-[4/3] md:col-span-2 md:row-span-2 md:aspect-square";
            else if (cycle === 1) spanClass = "col-span-3 aspect-[4/3] md:col-span-2 md:row-span-1 md:aspect-[2/1]";
            else spanClass = "col-span-3 aspect-[4/3] md:col-span-1 md:row-span-2 md:aspect-[1/2]";
          }
          return <VendorCardSkeleton key={i} className={spanClass} />;
        })}
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

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[1px]">
      {vendors.map((vendor, index) => {
        const isFeatured = (index + 1) % (featuredInterval + 1) === 0;
        const offset = randomOffsets[vendor.id] || 0;
        const currentImage =
          vendor.productImages.length > 0
            ? vendor.productImages[offset % vendor.productImages.length]
            : vendor.image;
        const isLoaded = imageLoadedStates[currentImage];

        let spanClass = "col-span-1 row-span-1 aspect-square";
        let titleClass = "text-[11px] sm:text-sm font-medium sm:font-bold";
        let badgeClass = "text-[10px] sm:text-xs font-semibold px-2 py-0.5";
        let containerPadding = "bottom-2 left-2 right-2";
        let topPadding = "top-2 right-2";

        if (isFeatured) {
          const cycle = Math.floor(index / (featuredInterval + 1)) % 3;
          if (cycle === 0) {
            spanClass = "col-span-3 aspect-[4/3] md:col-span-2 md:row-span-2 md:aspect-square";
            titleClass = "text-xl sm:text-2xl font-medium sm:font-bold";
            badgeClass = "text-xs font-medium px-3 py-1";
            containerPadding = "p-4";
            topPadding = "top-3 right-3";
          } else if (cycle === 1) {
            spanClass = "col-span-3 aspect-[4/3] md:col-span-2 md:row-span-1 md:aspect-[2/1]";
            titleClass = "text-xl sm:text-xl font-medium sm:font-bold";
            badgeClass = "text-[10px] sm:text-xs font-semibold px-2 py-0.5";
            containerPadding = "p-3";
            topPadding = "top-2 right-2";
          } else {
            spanClass = "col-span-3 aspect-[4/3] md:col-span-1 md:row-span-2 md:aspect-[1/2]";
            titleClass = "text-xl sm:text-lg font-medium sm:font-bold";
            badgeClass = "text-[10px] sm:text-xs font-semibold px-2 py-0.5";
            containerPadding = "p-3";
            topPadding = "top-2 right-2";
          }
        }

        return (
          <motion.div
            key={vendor.id}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className={cn("cursor-pointer relative overflow-hidden bg-gray-100", spanClass)}
            onClick={() => goToVendor(vendor.category, vendor.name, vendor.id)}
          >
            {!isLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer z-10" />
            )}
            <Image
              src={currentImage}
              alt={vendor.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-[1.02]"
              loading="lazy"
              sizes={isFeatured ? "100vw" : "(max-width: 768px) 33vw, 25vw"}
              quality={isFeatured ? 80 : 70}
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
            <div className={cn("absolute bg-white/85 backdrop-blur-sm rounded-full z-20", topPadding)}>
              <span className={cn("text-gray-700 whitespace-nowrap", badgeClass)}>
                {vendor.category}
              </span>
            </div>

            {/* Vendor name - bottom left */}
            <div className={cn("absolute bottom-0 left-0 right-0 z-20", isFeatured ? containerPadding : "")}>
              <p className={cn("text-white truncate drop-shadow-lg", titleClass, !isFeatured ? containerPadding : "")}>
                {sentenceCase(vendor?.name)}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default VendorList;
