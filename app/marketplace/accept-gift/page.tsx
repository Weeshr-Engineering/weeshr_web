"use client";

import { Suspense } from "react";
import AcceptGiftContent from "./_components/AcceptGiftContent";

export default function AcceptGiftPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <AcceptGiftContent />
    </Suspense>
  );
}
