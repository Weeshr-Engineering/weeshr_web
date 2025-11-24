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

const categoryColors: Record<string, string> = {
  Food: "bg-[#C6F4EB]",
  Fashion: "bg-[#DCDEFF]",
  Gadget: "bg-[#E9F4D1]",
  Lifestyle: "bg-[#C6EDF6]",
};

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        // Attach static colors to each category if available
        const enriched = data.map((cat: any) => ({
          ...cat,
          color: categoryColors[cat.name] || "bg-gray-100",
        }));
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
      `/marketplace/categories/${cat.name.toLowerCase()}?id=${
        cat._id
      }&name=${nameParam}`
    );
  };

  return (
    <div className="flex flex-col items-center p-6 max-h-max min-h-screen">
      {/* Header Section */}
      <div className="pt-10 md:pt-20 text-center lg:pt-28">
        <h1 className="mx-auto max-w-4xl text-3xl tracking-normal text-slate-900 sm:text-5xl font-normal">
          What would you like to{" "}
          <span
            className="relative whitespace-nowrap bg-gradient-custom bg-clip-text text-transparent text-3xl sm:text-5xl inline-flex items-center"
            style={{ fontFamily: "Playwrite CU, sans-serif" }}
          >
            <span className="inline-block h-[1.9em] overflow-hidden align-middle">
              <FlipWords
                words={[
                  "Send ?",
                  "gift ?",
                  "share ?",
                  "treat ?",
                  "celebrate ?",
                  "appreciate ?",
                  "delight?",
                ]}
                className="text-[#0CC990] mt-4"
              />
            </span>
          </span>
        </h1>

        <p className="mx-auto max-w-4xl text-lg tracking-tight text-center">
          <span className="inline-block text-muted-foreground w-4/5 lg:w-[60%]">
            Speak to your person in their love language
          </span>
        </p>
      </div>

      {/* Category Cards */}
      {loading ? (
        <CategorySkeletonGrid />
      ) : categories.length === 0 ? (
        <p className="pt-20 text-muted-foreground">No categories found</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl pt-14 md:pt-10">
          {categories.map((cat) => (
            <TiltedCard key={cat._id}>
              <Card
                onClick={() => handleClick(cat)}
                className={cn(
                  "rounded-3xl overflow-hidden shadow-lg transition cursor-pointer border-none relative h-80 lg:h-full pointer-events-auto",
                  activeCategory?._id === cat._id ? "ring-4 ring-[#0CC990]" : ""
                )}
              >
                {/* Background Image */}
                <Image
                  src={cat.image?.secure_url || "/placeholder.jpg"}
                  alt={cat.name}
                  fill
                  className="object-cover z-0 pointer-events-none"
                  priority
                />

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
  );
}
