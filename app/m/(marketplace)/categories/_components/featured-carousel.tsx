"use client";

import { useState, useEffect, useMemo } from "react";
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
  const nameParam = searchParams.get("name");
  const categoryId = searchParams.get("id");

  // Randomize and pick 5 vendors
  const featured = useMemo(() => {
    // Create a copy to sort
    return [...vendors].sort(() => 0.5 - Math.random()).slice(0, 5);
  }, [vendors]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate effect
  useEffect(() => {
    if (isPaused || featured.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, 500000);

    return () => clearInterval(interval);
  }, [isPaused, featured.length]);

  function slugify(str: string) {
    return str.toLowerCase().replace(/\s+/g, "-");
  }

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
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  if (!featured.length) return null;

  return (
    <div
      className="w-full pt-2  relative flex flex-col items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Header */}
      <div className="w-full px-4 mb-3 flex items-center justify-between z-20 relative">
        <div>
          <h2 className="text-2xl md:text-3xl font-medium text-primary flex items-center gap-2">
            <Icon
              icon="solar:star-fall-bold-duotone"
              className="text-[#0CC990] w-6 h-6"
            />
            {title}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            {subtitle}
          </p>
        </div>

        {/* Pagination Dots */}
        <div className="flex gap-1.5 items-center">
          {featured.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                idx === currentIndex ? "w-6 bg-[#0CC990]" : "w-1.5 bg-gray-200"
              )}
            />
          ))}
        </div>
      </div>

      {/* Full Width Hero Card */}
      <div className="relative w-full h-[150px]  md:h-[200px] px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={featured[currentIndex].id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-x-4 inset-y-0"
            onClick={() => handleVendorClick(featured[currentIndex])}
          >
            <Card className="w-full h-full overflow-hidden rounded-[2rem] shadow-2xl border-none relative bg-black cursor-pointer group">
              {/* Full Bleed Image */}
              <div className="absolute inset-0">
                <Image
                  src={featured[currentIndex].image}
                  alt={featured[currentIndex].name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                />
                {/* Cinematic Gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-10 md:pb-6 text-white z-20 flex flex-col items-start justify-end h-full pointer-events-none">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-full"
                >
                  <span className=" inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md border border-white/10 text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-widest mb-2 shadow-sm">
                    <Icon
                      icon="ph:crown-fill"
                      className="w-3 h-3 text-yellow-400"
                    />
                    {featured[currentIndex].category}
                  </span>

                  <h3 className="text-xl md:text-5xl font-bold font-display leading-tight mb-1 md:mb-2 drop-shadow-lg line-clamp-1 md:line-clamp-none">
                    {featured[currentIndex].name}
                  </h3>

                  <div className="flex items-end justify-between w-full gap-3 md:gap-4 md:mb-2">
                    <p className="flex-1 text-[10px] md:text-base text-gray-200 line-clamp-2 md:line-clamp-2 leading-tight opacity-90">
                      {featured[currentIndex].description ||
                        "Experience premium service and curated gifts."}
                    </p>

                    <Button
                      size="sm"
                      className="shrink-0 bg-[#0CC990] hover:bg-[#0bb07e] text-black font-semibold rounded-lg md:rounded-2xl pointer-events-auto transition-transform active:scale-95 h-7 md:h-11 px-3 md:px-8 text-[10px] md:text-base shadow-lg shadow-[#0CC990]/20 border border-white/10"
                    >
                      Visit Store
                      <Icon
                        icon="heroicons:arrow-right"
                        className="ml-1 md:ml-2 w-3 h-3 md:w-4 md:h-4"
                      />
                    </Button>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons (Floating) */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 z-30 hidden md:block">
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 border-none text-white"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
          >
            <Icon icon="heroicons:chevron-left" className="w-6 h-6" />
          </Button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-2 z-30 hidden md:block">
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 border-none text-white"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          >
            <Icon icon="heroicons:chevron-right" className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
