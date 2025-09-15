"use client";

import { TailwindcssButtons } from "@/components/commons/tailwind-buttons";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full mt-auto pt-20  p-4 md:pt-10">
      <div className="mx-auto flex items-center justify-between gap-6 px-4 py-6 flex-row sm:gap-0 sm:px-6 lg:px-8 reve">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Image
            src="https://res.cloudinary.com/drykej1am/image/upload/v1726082022/Weeshr_Light_lrreyo_4_addl75.png"
            alt="Weeshr Logo"
            width={140}
            height={40}
            className="h-auto w-auto"
            priority
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4 flex-row sm:gap-6 w-auto justify-end">
          <TailwindcssButtons width="w-48" height="h-12" />
        </div>
      </div>
    </footer>
  );
}
