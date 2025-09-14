"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { CometCard } from "@/components/ui/comet-card";
import TiltedCard from "./_components/tilted-card";
import { FlipWords } from "@/components/ui/flip-words";

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
  const { name } = useParams<{ name: string }>();

  return (
    <div className="flex flex-col items-center p-6 max-h-max">
      <div className="pt-10 md:pt-32">
        <h1 className="mx-auto max-w-4xl text-3xl tracking-normal text-slate-900 sm:text-5xl font-normal ">
          <span className="w-full">
            What would you like to
            <span className="relative whitespace-nowrap pr-1">
              <span
                className="relative whitespace-nowrap px-2 bg-gradient-custom bg-clip-text text-transparent text-3xl sm:text-5xl"
                style={{ fontFamily: "Playwrite CU, sans-serif" }}
              >
                send ?
                <FlipWords
                  words={["send ?", "gift ?"]}
                  className="inline-block "
                />
              </span>
            </span>
          </span>
        </h1>

        <p className="mx-auto max-w-4xl text-lg tracking-tight text-center pt-4">
          <span className="inline-block text-muted-foreground w-4/5 lg:w-[60%]">
            Speak to your person in their love language
          </span>
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl pt-14 md:pt-10">
        {categories.map((cat) => (
          <TiltedCard key={cat.title}>
            <Card className="rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer border-none relative h-80">
              {/* Background Image */}
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover z-0"
                priority
              />

              {/* Colored panel at the bottom */}
              <div
                className={`${cat.color} absolute bottom-0 left-0 right-0 h-24 flex items-center rounded-r-3xl z-20`}
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
