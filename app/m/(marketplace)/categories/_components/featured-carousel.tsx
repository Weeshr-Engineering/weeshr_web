"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Vendor } from "@/service/vendor.service";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

interface FeaturedCarouselProps {
  vendors: Vendor[];
  title?: string;
  subtitle?: string;
}

export default function FeaturedCarousel({
  vendors,
  title = "Top Picks",
  subtitle = "Featured vendors for you",
}: FeaturedCarouselProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageCache = useRef<Set<string>>(new Set());

  const nameParam = searchParams.get("name");
  const categoryId = searchParams.get("id");

  /** Pick up to 5 vendors randomly */
  const featured = useMemo(() => {
    return [...vendors].sort(() => 0.5 - Math.random()).slice(0, 5);
  }, [vendors]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  /** Pre-fetch next and previous images */
  useEffect(() => {
    if (featured.length <= 1) return;

    // Pre-fetch next and previous images
    const nextIndex = (currentIndex + 1) % featured.length;
    const prevIndex = (currentIndex - 1 + featured.length) % featured.length;

    const urlsToPrefetch = [
      featured[nextIndex].image,
      featured[prevIndex].image,
    ];

    urlsToPrefetch.forEach((url) => {
      if (!loadedImages.has(url) && !imageCache.current.has(url)) {
        const img = new window.Image();
        img.src = url;
        img.onload = () => {
          setLoadedImages((prev) => new Set(prev).add(url));
          imageCache.current.add(url);
        };
      }
    });
  }, [currentIndex, featured, loadedImages]);

  /** Handle image loading */
  const handleImageLoad = (imageUrl: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageUrl));
    imageCache.current.add(imageUrl);
    setIsLoading(false);
  };

  /** Auto rotate - only rotate when image is loaded */
  useEffect(() => {
    if (paused || featured.length <= 1 || isLoading) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % featured.length;
      const nextImage = featured[nextIndex].image;

      if (loadedImages.has(nextImage) || imageCache.current.has(nextImage)) {
        setCurrentIndex(nextIndex);
      } else {
        setIsLoading(true);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [paused, featured.length, currentIndex, isLoading, loadedImages]);

  const slugify = (str: string) => str.toLowerCase().replace(/\s+/g, "-");

  const handleVendorClick = (vendor: Vendor) => {
    const slug = slugify(vendor.name);
    const cat = vendor.category.toLowerCase();

    const query = new URLSearchParams({
      name: nameParam || "",
      vendorId: vendor.id,
    });

    if (categoryId) query.append("categoryId", categoryId);

    router.push(`/m/categories/${cat}/${slug}?${query.toString()}`);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % featured.length;
    const nextImage = featured[nextIndex].image;

    if (loadedImages.has(nextImage) || imageCache.current.has(nextImage)) {
      setCurrentIndex(nextIndex);
    } else {
      setIsLoading(true);
      setCurrentIndex(nextIndex);
    }
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + featured.length) % featured.length;
    const prevImage = featured[prevIndex].image;

    if (loadedImages.has(prevImage) || imageCache.current.has(prevImage)) {
      setCurrentIndex(prevIndex);
    } else {
      setIsLoading(true);
      setCurrentIndex(prevIndex);
    }
  };

  if (!featured.length) return null;

  // Get current vendor
  const currentVendor = featured[currentIndex];

  return (
    <section
      className="relative w-full flex flex-col gap-4 pt-4 md:pt-0"
      onMouseEnter={() => {
        setPaused(true);
        setShowArrows(true);
      }}
      onMouseLeave={() => {
        setPaused(false);
        setShowArrows(false);
      }}
      onTouchStart={() => {
        setPaused(true);
        setShowArrows(true);
      }}
      onTouchEnd={() => setPaused(false)}
    >
      {/* HEADER */}
      <div className="px-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
            <Icon
              icon="solar:star-fall-bold-duotone"
              className="text-[#0CC990] w-6 h-6"
            />
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {/* DOTS */}
        <div className="flex items-center gap-2">
          {featured.map((_, idx) => (
            <span
              key={idx}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                idx === currentIndex ? "w-6 bg-[#0CC990]" : "w-1.5 bg-gray-300"
              )}
            />
          ))}
        </div>
      </div>

      {/* CAROUSEL */}
      <div className="relative w-full px-1">
        <div
          className="
            relative w-full
            h-[150px]
            md:h-[200px]
          "
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVendor.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0"
              onClick={() => handleVendorClick(currentVendor)}
            >
              <Card className="relative h-full w-full overflow-hidden rounded-3xl border-none cursor-pointer bg-black">
                {/* IMAGE WITH LOADING STATE */}
                <div className="absolute inset-0">
                  {isLoading && !loadedImages.has(currentVendor.image) && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-800 via-gray-900 to-black animate-pulse z-0" />
                  )}
                  <Image
                    src={currentVendor.image}
                    alt={currentVendor.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    className={cn(
                      "object-cover transition-opacity duration-500",
                      loadedImages.has(currentVendor.image)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                    onLoad={() => handleImageLoad(currentVendor.image)}
                    onLoadingComplete={() =>
                      handleImageLoad(currentVendor.image)
                    }
                  />
                </div>

                {/* OVERLAYS */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-black/20" />

                {/* CONTENT */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 md:p-8 text-white">
                  <span className="mb-2 inline-flex items-center gap-1 bg-white/10 backdrop-blur border border-white/20 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest w-fit">
                    <Icon icon="ph:crown-fill" className="text-yellow-400" />
                    {currentVendor.category}
                  </span>

                  <h3 className="text-xl md:text-3xl font-extrabold leading-tight mb-2 line-clamp-1">
                    {currentVendor.name}
                  </h3>

                  <div className="flex items-end justify-between gap-4">
                    <p className="text-xs md:text-sm text-gray-200 line-clamp-2 max-w-[70%]">
                      {currentVendor.description ||
                        "Experience premium service and curated gifts."}
                    </p>

                    <Button
                      size="sm"
                      className="
                        bg-[#0CC990]
                        hover:bg-[#0bb07e]
                        text-black font-bold
                        rounded-xl
                        px-5
                        h-9
                        shadow-lg
                      "
                    >
                      Visit Store
                      <Icon
                        icon="heroicons:arrow-right"
                        className="ml-2 w-4 h-4"
                      />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* ARROWS */}
          <AnimatePresence>
            {showArrows && featured.length > 1 && (
              <>
                {/* LEFT ARROW - UNCOMMENT IF NEEDED */}
                {/* <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/10 backdrop-blur border border-white/20 items-center justify-center hover:bg-white/20 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  disabled={isLoading}
                >
                  <Icon
                    icon="solar:alt-arrow-left-linear"
                    className="w-6 h-6 text-white"
                  />
                </motion.button> */}

                {/* RIGHT ARROW */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="hidden md:flex absolute right-6 top-[30%] -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/10 backdrop-blur border border-white/20 items-center justify-center hover:bg-white/20 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  disabled={isLoading}
                >
                  <Icon
                    icon="solar:alt-arrow-right-linear"
                    className="w-6 h-6 text-white"
                  />
                </motion.button>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
