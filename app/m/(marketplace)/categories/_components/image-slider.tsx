"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

interface ImageSliderProps {
  images: string[];
  alt: string;
  autoplayDelay?: number;
  className?: string;
  imageClassName?: string;
  aspectRatio?: string;
  onImageClick?: (index: number) => void;
  showDots?: boolean;
  showArrows?: boolean;
  startIndex?: number;
  enableAutoplay?: boolean;
}

export function ImageSlider({
  images,
  alt,
  autoplayDelay = 4000,
  className,
  imageClassName,
  aspectRatio = "aspect-[3/4]",
  onImageClick,
  showDots = true,
  showArrows = false,
  startIndex = 0,
  enableAutoplay = true,
}: ImageSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 40,
      skipSnaps: false,
      startIndex,
    },
    enableAutoplay
      ? [
          Autoplay({
            delay: autoplayDelay,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]
      : [],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [tweenValues, setTweenValues] = useState<number[]>([]);

  const onScroll = useCallback((emblaApi: any) => {
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();

    const styles = emblaApi
      .scrollSnapList()
      .map((scrollSnap: number, index: number) => {
        let diffToTarget = scrollSnap - scrollProgress;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopPoint: any) => {
            const target = loopPoint.target();
            if (index === loopPoint.index && target !== 0) {
              const sign = Math.sign(target);
              if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
              if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
            }
          });
        }
        return diffToTarget * (-1 / 1.5) * 100; // Parallax factor
      });
    setTweenValues(styles);
  }, []);

  const onInit = useCallback(
    (emblaApi: any) => {
      setScrollSnaps(emblaApi.scrollSnapList());
      onScroll(emblaApi);
    },
    [onScroll],
  );

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", onScroll);
  }, [emblaApi, onInit, onSelect, onScroll]);

  const scrollPrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (emblaApi) emblaApi.scrollPrev();
    },
    [emblaApi],
  );

  const scrollNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (emblaApi) emblaApi.scrollNext();
    },
    [emblaApi],
  );

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden group/slider w-full h-full",
        className,
      )}
    >
      <div className="overflow-hidden h-full w-full" ref={emblaRef}>
        <div className="flex h-full w-full">
          {images.map((src, index) => (
            <div
              key={index}
              className={cn(
                "relative flex-[0_0_100%] min-w-0 h-full",
                aspectRatio,
              )}
              onClick={() => onImageClick?.(index)}
            >
              <div className="absolute inset-0 overflow-hidden bg-gray-100">
                <Image
                  src={src}
                  alt={`${alt} - image ${index + 1}`}
                  fill
                  className={cn(
                    "object-cover transition-opacity duration-700 ease-in-out",
                    loadedImages[index] ? "opacity-100" : "opacity-0",
                    imageClassName,
                  )}
                  style={{
                    transform: `translateX(${tweenValues[index] || 0}%)`,
                  }}
                  onLoad={() => handleImageLoad(index)}
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority={index === 0}
                  quality={85}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1.5 pointer-events-none">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-1 rounded-full transition-all duration-300 pointer-events-auto",
                index === selectedIndex
                  ? "w-6 bg-white shadow-sm"
                  : "w-1.5 bg-white/40",
              )}
              onClick={(e) => {
                e.stopPropagation();
                scrollTo(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 backdrop-blur-md transition-all duration-300",
              "opacity-0 group-hover/slider:opacity-100 flex",
            )}
            onClick={scrollPrev}
            aria-label="Previous image"
          >
            <Icon icon="ph:caret-left-bold" className="w-4 h-4" />
          </button>
          <button
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 backdrop-blur-md transition-all duration-300",
              "opacity-0 group-hover/slider:opacity-100 flex",
            )}
            onClick={scrollNext}
            aria-label="Next image"
          >
            <Icon icon="ph:caret-right-bold" className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}
