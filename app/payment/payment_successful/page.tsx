"use client";

import React from "react";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-[#F8F9FF] p-4">
      <Image
        className="mb-4"
        width={397}
        height={90}
        src="https://res.cloudinary.com/dufimctfc/image/upload/v1720680616/payment_successful_ngaawv.svg"
        alt="Payment Successful"
      />
      <div className="flex flex-col items-center justify-center mb-5 text-center">
        <p className="text-2xl font-bold text-[#111827] md:text-3xl lg:text-4xl">
          Payment Successful
        </p>
        <p className="mt-4 text-sm text-[#6B7280] md:text-lg lg:text-xl">
          Your payment has been successfully completed
        </p>
      </div>
      <Link href="/">
        <Button className="w-auto bg-[#BAEF23] hover:bg-lime-500 rounded-full font-bold text-[#020721]">
          Go Home
        </Button>
      </Link>
    </div>
  );
};

export default ErrorPage;
