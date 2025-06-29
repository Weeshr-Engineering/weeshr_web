"use client";

import React, { useState } from "react";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const ErrorPage = () => {
  const [failedImg, setFailedImg] = useState('https://res.cloudinary.com/drykej1am/image/upload/v1746961505/weehser%20pay/Illustration_1_c0tedl.png')

  const setFallbackImage = () => {
    setFailedImg('/logo.svg')
  };
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-[#F8F9FF] p-4">
      <Image
        className="mb-4"
        src={failedImg}
        onError={setFallbackImage}
        alt="errorpage"
        width={397}
        height={90}
      />
      <div className="flex flex-col items-center justify-center mb-5 text-center">
        <p className="text-2xl font-bold text-[#111827] md:text-3xl lg:text-4xl">
          Page not Found
        </p>
        <p className="mt-4 text-sm text-[#6B7280] md:text-lg lg:text-xl">
          Oops! Looks like you followed a bad link. If you think this is a problem with us, please tell us.
        </p>
      </div>
      <Link href="/">
        <Button className="w-auto bg-[#BAEF23] hover:bg-lime-500 rounded-full  font-bold text-[#020721]">
          Go Home
        </Button>
      </Link>
    </div>
  );
};

export default ErrorPage;
