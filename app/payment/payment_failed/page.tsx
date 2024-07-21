"use client";

import React from "react";
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link';

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-[#F8F9FF] p-4">
      <Image
        className="mb-4"
        width={397}
        height={90}
        src="https://res.cloudinary.com/dufimctfc/image/upload/v1720680326/payment_failed_ro0qx3.svg"
        alt="Payment Failed"
      />
      
      <div className="flex flex-col items-center justify-center mb-5 text-center">
        <p className="text-2xl font-bold text-[#111827] md:text-3xl lg:text-4xl">
          Payment Failed          
        </p>
        <p className="mt-4 text-sm text-[#6B7280] md:text-lg lg:text-xl">
        There was an issue with your payment. Please try again
        </p>
      </div>
      <Link href="/" passHref>
        <Button className="w-auto bg-[#BAEF23] hover:bg-lime-500 rounded-full  font-bold text-[#020721]">
          Go Home
        </Button>
      </Link>
    </div>
  );
};

export default ErrorPage;
