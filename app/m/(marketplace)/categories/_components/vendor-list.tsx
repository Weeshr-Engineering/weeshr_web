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

  // Track image loading state for each vendor
  const [imageLoadedStates, setImageLoadedStates] = React.useState<
    Record<string, boolean>
  >({});

  // Generate random starting offsets for each vendor once per mount
  const [randomOffsets] = React.useState<Record<string, number>>({});
  const [randomStyles] = React.useState<Record<string, number>>({});

  // Initialize random offsets and styles
  React.useMemo(() => {
    vendors.forEach((vendor, index) => {
      if (vendor.productImages.length > 1 && !randomOffsets[vendor.id]) {
        randomOffsets[vendor.id] = Math.floor(
          Math.random() * vendor.productImages.length,
        );
      }
      if (randomStyles[vendor.id] === undefined) {
        if (index === 0) {
          randomStyles[vendor.id] = 0; // single 2x2 big box — only the first item
        } else {
          // Desktop only: variety from spanning tiles WITHOUT extra big boxes
          // (extra 2x2 tiles eat space and show fewer items at the top).
          // 1 = 2x1 horizontal, 2 = 1x2 vertical, 3 = regular
          const r = Math.random();
          if (r < 0.14)
            randomStyles[vendor.id] = 1; // 2x1 horizontal (14%)
          else if (r < 0.28)
            randomStyles[vendor.id] = 2; // 1x2 vertical (14%)
          else randomStyles[vendor.id] = 3; // regular 1x1 (72%)
        }
      }
    });
  }, [vendors, randomOffsets, randomStyles]);

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

  const getCardStyles = (index: number, vendorId?: string) => {
    const isMobileFeatured = (index + 1) % 10 === 0;

    let isDesktop2x2 = false;
    let isDesktop2x1 = false;
    let isDesktop1x2 = false;

    if (vendorId && randomStyles[vendorId] !== undefined) {
      const code = randomStyles[vendorId];
      isDesktop2x2 = code === 0;
      isDesktop2x1 = code === 1;
      isDesktop1x2 = code === 2;
    } else {
      // Fallback (skeletons / styles not yet computed):
      // only the very first item is the big 2x2 — never a second one.
      const desktopCycle = index % 15;
      isDesktop2x2 = index === 0;
      isDesktop2x1 = desktopCycle === 7;
      isDesktop1x2 = desktopCycle === 11;
    }

    let spanClass = "";
    let titleClass = "font-medium sm:font-bold drop-shadow-md text-white ";
    let badgeClass = "font-semibold whitespace-nowrap text-gray-700 ";
    let containerPadding = "absolute z-20 ";
    let topPadding = "absolute bg-white/85 backdrop-blur-sm rounded-full z-20 ";
    let imageQuality = 70;
    let imageSizes = "(max-width: 768px) 33vw, 25vw";

    // --- Mobile classes ---
    if (isMobileFeatured) {
      spanClass += "col-span-3 aspect-[4/3] ";
      titleClass += "text-xl sm:text-2xl whitespace-normal break-words ";
      badgeClass += "text-xs px-3 py-1 ";
      containerPadding += "bottom-0 left-0 right-0 p-4 ";
      topPadding += "top-3 right-3 ";
      imageQuality = 80;
      imageSizes = "100vw";
    } else {
      spanClass += "col-span-1 aspect-square ";
      titleClass += "text-[12px] sm:text-sm truncate ";
      badgeClass += "text-[12px] sm:text-xs px-2 py-0.5 ";
      containerPadding += "bottom-2 left-2 right-2 ";
      topPadding += "top-2 right-2 ";
    }

    // --- Desktop classes ---
    if (isDesktop2x2) {
      spanClass += "md:col-span-2 md:row-span-2 md:aspect-square ";
      titleClass +=
        "md:text-2xl md:whitespace-normal md:break-words md:tracking-tight ";
      badgeClass += "md:text-xs md:px-3 md:py-1 ";
      containerPadding += "md:bottom-0 md:left-0 md:right-0 md:p-4 ";
      topPadding += "md:top-3 md:right-3 ";
      imageQuality = 80;
      imageSizes = "(max-width: 768px) 100vw, 50vw";
    } else if (isDesktop2x1) {
      spanClass += "md:col-span-2 md:row-span-1 md:aspect-[2/1] ";
      titleClass +=
        "md:text-xl md:whitespace-normal md:break-words md:tracking-tight ";
      badgeClass += "md:text-xs md:px-3 md:py-1 ";
      containerPadding += "md:bottom-0 md:left-0 md:right-0 md:p-3 ";
      topPadding += "md:top-3 md:right-3 ";
      imageSizes = "(max-width: 768px) 100vw, 50vw";
    } else if (isDesktop1x2) {
      spanClass += "md:col-span-1 md:row-span-2 md:aspect-[1/2] ";
      titleClass +=
        "md:text-lg md:whitespace-normal md:break-words md:tracking-tight ";
      badgeClass += "md:text-xs md:px-2 md:py-0.5 ";
      containerPadding += "md:bottom-0 md:left-0 md:right-0 md:p-3 ";
      topPadding += "md:top-2 md:right-2 ";
    } else {
      spanClass += "md:col-span-1 md:row-span-1 md:aspect-square ";
      titleClass += "md:text-sm md:truncate ";
      badgeClass += "md:text-xs md:px-2 md:py-0.5 ";
      containerPadding += "md:bottom-2 md:left-2 md:right-2 md:p-0 ";
      topPadding += "md:top-2 md:right-2 ";
    }

    return {
      spanClass,
      titleClass,
      badgeClass,
      containerPadding,
      topPadding,
      imageQuality,
      imageSizes,
    };
  };

  if (loading) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0 grid-flow-row-dense">
        {Array.from({ length: 20 }).map((_, i) => {
          const { spanClass } = getCardStyles(i);
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
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0 grid-flow-row-dense">
      {vendors.map((vendor, index) => {
        const offset = randomOffsets[vendor.id] || 0;
        const currentImage =
          vendor.productImages.length > 0
            ? vendor.productImages[offset % vendor.productImages.length]
            : vendor.image;
        const isLoaded = imageLoadedStates[currentImage];

        const {
          spanClass,
          titleClass,
          badgeClass,
          containerPadding,
          topPadding,
          imageQuality,
          imageSizes,
        } = getCardStyles(index, vendor.id);

        return (
          <motion.div
            key={vendor.id}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className={cn(
              "cursor-pointer relative overflow-hidden bg-gray-100",
              spanClass,
            )}
            onClick={() => goToVendor(vendor.category, vendor.name, vendor.id)}
          >
            {!isLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer z-0" />
            )}
            <Image
              src={currentImage}
              alt={vendor.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-[1.02] z-[1]"
              loading="lazy"
              sizes={imageSizes}
              quality={imageQuality}
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
            <div className={topPadding}>
              <span className={badgeClass}>{vendor.category}</span>
            </div>

            {/* Vendor name - bottom left */}
            <div className={containerPadding}>
              <p className={titleClass}>{sentenceCase(vendor?.name)}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default VendorList;
