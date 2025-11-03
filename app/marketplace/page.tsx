"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import Link from "next/link"; // ⬅️ add this
import { useRouter } from "next/navigation";

export default function Home() {
  const [receiverName, setReceiverName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverName.trim()) return;
    // Encode receiver name for URL safety
    const encodedName = encodeURIComponent(receiverName.trim());
    router.push(`marketplace/categories?name=${encodedName}`);
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Image Section */}
      {/* Left Image Section */}
      <div className="relative flex-1 hidden md:block m-6">
        <Image
          src="https://res.cloudinary.com/drykej1am/image/upload/v1757702462/weeshr-marketplace/Rectangle_3870_q7bea5.png"
          alt="Background"
          fill
          className="object-cover rounded-3xl"
          priority
        />

        {/* Overlay Text at the base */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <p className="text-3xl font-semibold">
            <span
              className={`relative whitespace-nowrap px-2 bg-gradient-custom bg-clip-text text-transparent text-xl sm:text-3xl pb-8`}
              style={{ fontFamily: "Playwrite CU, sans-serif" }}
            >
              Surprise
            </span>
          </p>
          <p className="text-2xl">the ones you love,</p>
          <p className="text-2xl">send them a gift</p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 md:pb-40 relative">
        <Image
          src="https://res.cloudinary.com/drykej1am/image/upload/v1704590628/weeshr_website/c9jufgt5n7dm009cehr4.png"
          alt="Weeshr Logo"
          width={144}
          height={48}
          className="mb-8 md:mb-28 hidden md:block"
          priority
        />
        <Card className="w-full max-w-sm bg-white/80 backdrop-blur-sm shadow-lg px-0 rounded-3xl bg-[#E9F4D1] border-none">
          <CardHeader className="px-5 py-4">
            <CardTitle className="text-xl   text-primary text-left p-0">
              <span className="relative text-primary pr-1  font-normal">
                Who would you like to
                <span
                  className={`relative whitespace-nowrap px-2 bg-gradient-custom bg-clip-text text-transparent text-xl sm:text-xl `}
                  style={{ fontFamily: "Playwrite CU, sans-serif" }}
                >
                  gift?
                </span>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-1 rounded-xl border-none">
            <PlaceholdersAndVanishInput
              placeholders={[
                "Enter receiver's name",
                "Gift someone special 🎁",
                "Type a friend's name...",
                "Who’s the lucky person ? ✨",
                "Surprise someone today 🎉",
                "Add a name to start gifting",
                "Search for a loved one ❤️",
                "Who deserves a treat ? 🍫",
                "Enter a colleague’s name 👔",
                "Make someone smile 😊",
              ]}
              onChange={(e) => setReceiverName(e.target.value)}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>{" "}
        <Link
          href="/"
          className="text-white absolute bottom-20 hover:underline transition"
        >
          weeshr.com
        </Link>{" "}
      </div>
    </div>
  );
}
