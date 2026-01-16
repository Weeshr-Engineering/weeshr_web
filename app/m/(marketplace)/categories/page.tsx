"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import TiltedCard from "./_components/tilted-card";
import { FlipWords } from "@/components/ui/flip-words";
import { cn } from "@/lib/utils";
import { fetchCategories } from "@/lib/api";
import CategorySkeletonGrid from "./_components/CategorySkeleton";
import { motion } from "framer-motion";

const categoryColors: Record<string, string> = {
  Food: "bg-[#C6F4EB]",
  Foods: "bg-[#C6F4EB]",
  Fashion: "bg-[#DCDEFF]",
  Gadget: "bg-[#E9F4D1]",
  Gadgets: "bg-[#E9F4D1]",
  Lifestyle: "bg-[#C6EDF6]",
  Lifestyles: "bg-[#C6EDF6]",
};

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoadedStates, setImageLoadedStates] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        // Attach static colors to each category if available and sort Fashion to top
        const enriched = data
          .map((cat: any) => ({
            ...cat,
            color: categoryColors[cat.name] || "bg-gray-100",
          }))
          .sort((a: any, b: any) => {
            const nameA = a.name?.toLowerCase() || "";
            const nameB = b.name?.toLowerCase() || "";
            if (nameA === "fashion") return -1;
            if (nameB === "fashion") return 1;
            return 0;
          });
        setCategories(enriched);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  const nameParam = searchParams.get("name");
  const activeCategory = categories.find(
    (cat) => cat.name.toLowerCase() === nameParam?.toLowerCase()
  );

  const handleClick = (cat: any) => {
    if (!cat?.name || !cat?._id) {
      console.warn("Invalid category:", cat);
      return;
    }

    // Use category name in the path and pass both id and name as query parameters
    router.push(
      `/m/categories/${cat.name.toLowerCase()}?id=${cat._id}&name=${nameParam}`
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header Section */}
      <div className="pt-10 md:pt-20 text-center shrink-0">
        <h1 className="mx-auto max-w-4xl text-3xl tracking-normal text-slate-900 sm:text-5xl font-normal text-center ">
          What would you like to{" "}
          <span
            className="relative whitespace-nowrap bg-gradient-custom bg-clip-text text-transparent text-3xl sm:text-5xl inline-flex items-center"
            style={{
              fontFamily:
                "var(--font-playwrite), 'Playwrite CU', cursive, sans-serif",
            }}
          >
            {/* Remove the fixed height container and use min-height instead */}
            <span className="inline-block min-h-[2em] overflow-visible align-middle">
              <FlipWords
                words={[
                  "gift ? ",
                  "share ? ",
                  "treat ? ",
                  "celebrate ? ",
                  "appreciate ? ",
                  "delight ? ",
                ]}
                className="text-[#0CC990] mt-4"
              />
            </span>
          </span>
        </h1>

        <p className="mx-auto max-w-4xl text-lg tracking-tight text-center">
          <span className="inline-block text-muted-foreground w-4/5 lg:w-[60%]">
            Select the category of gift{" "}
            <motion.span
              className="inline-block align-middle drop-shadow-md opacity-100 text-foreground ml-0"
              style={{
                fontSize: "2.5rem", // Larger font size for sharpness
                lineHeight: 1,
              }}
              animate={{
                rotate: [0, 10, -10, 10, -5, 5, 0],
                scale: [0.8, 0.9, 0.8], // Scaling down from a larger size keeps it sharp
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
            >
              🎁
            </motion.span>
          </span>
        </p>
      </div>

      {/* Category Cards - Scrollable area */}
      <div className="flex-1 overflow-y-auto mt-8 md:mt-4 px-4 pb-10 scrollbar-hide">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <CategorySkeletonGrid />
          ) : categories.length === 0 ? (
            <p className="pt-20 text-center text-muted-foreground">
              No categories found
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {categories.map((cat) => (
                <TiltedCard key={cat._id}>
                  <Card
                    onClick={() => handleClick(cat)}
                    className={cn(
                      "rounded-3xl overflow-hidden shadow-lg transition cursor-pointer border-none relative h-80 lg:h-[400px] pointer-events-auto",
                      activeCategory?._id === cat._id
                        ? "ring-4 ring-[#0CC990]"
                        : ""
                    )}
                  >
                    {/* Background Image Container */}
                    <div className="absolute inset-0 z-0 bg-gray-100">
                      {/* Shimmer skeleton while loading */}
                      {!imageLoadedStates[cat._id] && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer z-10" />
                      )}

                      <motion.div
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{
                          opacity: imageLoadedStates[cat._id] ? 1 : 0,
                          scale: imageLoadedStates[cat._id] ? 1 : 1.05,
                        }}
                        transition={{
                          duration: 0.4,
                          ease: [0.25, 0.1, 0.25, 1],
                        }}
                        className="w-full h-full"
                      >
                        <Image
                          src={cat.image?.secure_url}
                          alt={cat.name}
                          fill
                          className="object-cover pointer-events-none transition-transform duration-500 hover:scale-110"
                          priority
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          onLoad={() => {
                            setImageLoadedStates((prev) => ({
                              ...prev,
                              [cat._id]: true,
                            }));
                          }}
                          onError={() => {
                            setImageLoadedStates((prev) => ({
                              ...prev,
                              [cat._id]: true,
                            }));
                          }}
                        />
                      </motion.div>
                    </div>

                    {/* Colored panel at the bottom */}
                    <div
                      className={`${cat.color} absolute bottom-0 left-0 right-0 h-24 lg:h-[100px] flex items-center rounded-r-3xl z-20 pointer-events-none`}
                    >
                      <CardHeader className="p-4">
                        <CardTitle className="text-left text-2xl font-light">
                          {cat.name}
                        </CardTitle>
                      </CardHeader>
                    </div>
                  </Card>
                </TiltedCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
