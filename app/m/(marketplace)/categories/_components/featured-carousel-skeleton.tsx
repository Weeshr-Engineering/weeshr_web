"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedCarouselSkeleton() {
  return (
    <div className="w-full pt-2 relative flex flex-col items-center">
      {/* Header Skeleton */}
      <div className="w-full px-4 mb-3 flex items-center justify-between z-20 relative">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-lg" /> {/* Title */}
          <Skeleton className="h-4 w-32 rounded-lg" /> {/* Subtitle */}
        </div>

        {/* Pagination Dots Skeleton */}
        <div className="flex gap-1.5 items-center">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-1.5 w-1.5 rounded-full" />
          ))}
        </div>
      </div>

      {/* Main Card Skeleton */}
      <div
        className="relative w-full    h-[150px]
            md:h-[200px] px-4"
      >
        <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
          <Skeleton className="w-full h-full" />

          {/* Content Overlay Skeleton */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-20 flex flex-col items-start justify-end h-full">
            <Skeleton className="h-5 w-24 rounded-full mb-3 bg-white/20" />{" "}
            {/* Badge */}
            <Skeleton className="h-8 w-3/4 rounded-lg mb-3 bg-white/20" />{" "}
            {/* Title */}
            <div className="flex items-end justify-between w-full gap-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-full rounded bg-white/20" />
                <Skeleton className="h-3 w-2/3 rounded bg-white/20" />
              </div>
              <Skeleton className="h-10 w-32 rounded-xl bg-white/20" />{" "}
              {/* Button */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
