"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function RedirectGuard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nameParam = searchParams.get("name");

  useEffect(() => {
    if (nameParam === "null" || !nameParam) {
      router.replace("/m");
    }
  }, [nameParam, router]);

  return null;
}
