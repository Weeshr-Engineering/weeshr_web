"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProductNotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <Icon icon="ph:mask-sad-bold" className="w-16 h-16 text-gray-300 mb-4" />
      <h1 className="text-xl font-bold text-gray-900">Product not found</h1>
      <p className="text-gray-500 mb-6">
        The product you're looking for doesn't exist or is unavailable.
      </p>
      <Button
        onClick={() => router.back()}
        variant="marketplace"
        className="rounded-full px-8"
      >
        Go Back
      </Button>
    </div>
  );
}
