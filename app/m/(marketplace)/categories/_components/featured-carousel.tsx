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

  /** Pick up to 5 vendors randomly */
  const featured = useMemo(() => {
    return [...vendors].sort(() => 0.5 - Math.random()).slice(0, 5);
  }, [vendors]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  /** Auto rotate */
  useEffect(() => {
    if (paused || featured.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [paused, featured.length]);

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

  if (!featured.length) return null;

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
      <div className="relative w-full px-4">
        <div
          className="
            relative w-full
            h-[150px]
            md:h-[200px]
         
        
          "
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={featured[currentIndex].id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0"
              onClick={() => handleVendorClick(featured[currentIndex])}
            >
              <Card className="relative h-full w-full overflow-hidden rounded-3xl border-none cursor-pointer bg-black">
                {/* IMAGE */}
                <Image
                  src={featured[currentIndex].image}
                  alt={featured[currentIndex].name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  className="object-cover"
                />

                {/* OVERLAYS */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-black/20" />

                {/* CONTENT */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 md:p-8 text-white">
                  <span className="mb-2 inline-flex items-center gap-1 bg-white/10 backdrop-blur border border-white/20 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest w-fit">
                    <Icon icon="ph:crown-fill" className="text-yellow-400" />
                    {featured[currentIndex].category}
                  </span>

                  <h3 className="text-xl md:text-3xl font-extrabold leading-tight mb-2 line-clamp-1">
                    {featured[currentIndex].name}
                  </h3>

                  <div className="flex items-end justify-between gap-4">
                    <p className="text-xs md:text-sm text-gray-200 line-clamp-2 max-w-[70%]">
                      {featured[currentIndex].description ||
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
            {showArrows && (
              <>
                {/* LEFT */}
                {/* <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="hidden md:flex absolute left-6 top-[10%] -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/10 backdrop-blur border border-white/20 items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(
                      (prev) => (prev - 1 + featured.length) % featured.length
                    );
                  }}
                >
                  <Icon
                    icon="solar:alt-arrow-left-linear"
                    className="w-6 h-6 text-white"
                  />
                </motion.button> */}

                {/* RIGHT */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="hidden md:flex absolute right-6 top-[30%] -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/10 backdrop-blur border border-white/20 items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex((prev) => (prev + 1) % featured.length);
                  }}
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
