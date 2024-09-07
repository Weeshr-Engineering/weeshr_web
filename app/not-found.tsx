"use client";

import React from "react";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ErrTypeLayout } from "@/components/NotFound-type-layout";

const ErrorPage = () => {
  return (
    <ErrTypeLayout>
    <div className="flex flex-col items-center justify-center w-full h-[100]  p-4">
      <Image
        className="mb-4 h-auto w-16 md:w-24"
        src="https://res.cloudinary.com/dufimctfc/image/upload/v1724603226/top-quality-emoticon-closing-eyes-flat-emoji-closing-eyes-with-hand-yellow-face-emoji-popular-element_686498-2711-removebg-preview_topycq.png"
        alt="errorpage"
        width={100}
        height={40}
      />
      <div className="flex flex-col items-center justify-center mb-5 text-center">
        <p className="text-2xl font-bold text-[#111827] md:text-3xl lg:text-6xl">
          Page Not Found
        </p>
        <p className="mt-4 text-sm text-[#6B7280] md:text-lg lg:text-xl">
        Retrace your URL path
                </p>
      </div>
      <Link href="/">
          <Button className="w-36 md:w-52 bg-[#020721] hover:bg-gray-500 rounded-sm text-sm text-[#FFFFFF]">
            Go Home
          </Button>
        </Link>
    </div>
    </ErrTypeLayout>
  );
};

export default ErrorPage;
