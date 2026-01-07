"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Vendor } from "@/service/vendor.service";

interface LandingClientProps {
  vendor: Vendor;
}

export default function LandingClient({ vendor }: LandingClientProps) {
  const router = useRouter();
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Slugify logic matching vendor-list.tsx
    const slug = vendor.name.toLowerCase().replace(/\s+/g, "-");
    const category = vendor.category.toLowerCase();

    // Construct target URL
    // matches: /marketplace/categories/lifestyle/mwanga-africa?name=jake&categoryId=null&vendorId=694c0cddb74c3b8e191da75a
    const url = `/marketplace/categories/${category}/${slug}?name=${encodeURIComponent(
      name
    )}&categoryId=null&vendorId=${vendor.id}`;

    router.push(url);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full p-4">
      <Card className="w-full max-w-md overflow-hidden bg-white/95 backdrop-blur-md border border-white/20 shadow-2xl rounded-[32px]">
        <div className="relative h-56 w-full">
          <Image
            src="https://res.cloudinary.com/drykej1am/image/upload/v1767725180/market-place/vendors/Rectangle_3870_1_wfzehc.png"
            alt="Vendor Presentation"
            fill
            className="object-cover"
            priority
          />
          {/* Vendor Logo Overlay */}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white flex items-center justify-center">
              <Image
                src={vendor.image}
                alt={vendor.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <CardContent className="pt-14 pb-8 px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {vendor.name}
          </h1>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
            Enter your name to start exploring gifts from{" "}
            <span className="font-medium text-gray-700">{vendor.name}</span>.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 text-center text-lg rounded-2xl bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                autoFocus
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338ca] hover:to-[#6d28d9] text-white"
            >
              Start Gifting
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
