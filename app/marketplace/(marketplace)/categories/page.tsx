"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import TiltedCard from "./_components/tilted-card";
import { FlipWords } from "@/components/ui/flip-words";
import { cn } from "@/lib/utils";

const categories = [
  {
    title: "Food",
    image:
      "https://res.cloudinary.com/drykej1am/image/upload/v1757806163/weeshr-marketplace/food_c2n9cf.png",
    color: "bg-[#C6F4EB]",
  },
  {
    title: "Fashion",
    image:
      "https://res.cloudinary.com/drykej1am/image/upload/v1757806164/weeshr-marketplace/fashion_hl0xe1.png",
    color: "bg-[#DCDEFF]",
  },
  {
    title: "Gadgets",
    image:
      "https://res.cloudinary.com/drykej1am/image/upload/v1757806163/weeshr-marketplace/gadget_rzmwyw.png",
    color: "bg-[#E9F4D1]",
  },
  {
    title: "Lifestyle",
    image:
      "https://res.cloudinary.com/drykej1am/image/upload/v1757806163/weeshr-marketplace/style_nqxqv7.png",
    color: "bg-[#C6EDF6]",
  },
];

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const nameParam = searchParams.get("name");
  const activeCategory = categories.find(
    (cat) => cat.title.toLowerCase() === nameParam?.toLowerCase()
  );

  const handleClick = (title: string) => {
    router.push(
      `/marketplace/categories/${title.toLowerCase()}?name=${nameParam}`
    );
  };

  return (
    <div className="flex flex-col items-center p-6 max-h-max">
      <div className="pt-10 md:pt-20 text-center lg:pt-28
      ">
        <h1 className="mx-auto max-w-4xl text-3xl tracking-normal text-slate-900 sm:text-5xl font-normal">
          What would you like to{" "}
          <span
            className="relative whitespace-nowrap bg-gradient-custom bg-clip-text text-transparent text-3xl sm:text-5xl inline-flex items-center"
            style={{ fontFamily: "Playwrite CU, sans-serif" }}
          >
            {/* lock the FlipWords container height so it doesn’t push/pull surrounding text */}
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl pt-14 md:pt-10 ">
        {categories.map((cat) => (
          <TiltedCard key={cat.title}>
            <Card
              onClick={() => handleClick(cat.title)}
              className={cn(
                "rounded-3xl overflow-hidden shadow-lg transition cursor-pointer border-none relative h-80 lg:h-full pointer-events-auto",
                activeCategory?.title === cat.title
                  ? "ring-4 ring-[#0CC990]"
                  : ""
              )}
            >
              {/* Background Image */}
              <Image
                src={cat.image}
                alt={cat.title}
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
                    {cat.title}
                  </CardTitle>
                </CardHeader>
              </div>
            </Card>
          </TiltedCard>
        ))}
      </div>
    </div>
  );
}
