"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

interface StatusMessageProps {
  isSuccess: boolean;
  isAlreadyVerified?: boolean;
}

const StatusMessage: React.FC<StatusMessageProps> = ({
  isSuccess,
  isAlreadyVerified,
}) => {
  const handleClose = () => {
    if (window.parent) {
      window.parent.postMessage("closeIframe", "*");
    }
  };

  if (isSuccess) {
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
          <h3 className="text-2xl font-bold text-[#111827] md:text-3xl lg:text-4xl">
            
          {isAlreadyVerified
                ? "Payment Successful"
                : "Payment Done!"}
                
          </h3>
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
  } else {
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
        <Link href="/">
          <Button className="w-auto bg-[#BAEF23] hover:bg-lime-500 rounded-full  font-bold text-[#020721]">
            Go Home
          </Button>
        </Link>
      </div>
    );
  }
};

const ErrorMessage: React.FC = () => {
  const handleClose = () => {
    if (window.parent) {
      window.parent.postMessage("closeIframe", "*");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white md:mx-auto">
        <svg
          viewBox="0 0 24 24"
          className="w-16 h-16 mx-auto my-6 text-red-600"
        >
          <path
            fill="currentColor"
            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
          ></path>
        </svg>
        <div className="text-center">
          <h3 className="text-base font-semibold text-center text-gray-900 md:text-2xl">
            Error!
          </h3>
          <p className="my-2 text-gray-600">
            Missing reference. Please check the URL and try again.
          </p>
          <p>Have a great day!</p>
          <div className="py-10 text-center">
            <button
              onClick={handleClose}
              className="px-12 py-3 font-semibold text-white bg-indigo-600 rounded-2xl hover:bg-indigo-500"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusPage = () => {
  const searchParams = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const reference = searchParams.get("reference");

  useEffect(() => {
    if (!reference) {
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `https://api.staging.weeshr.com/api/v1/payments/transaction/verify/${reference}`
        );
        if (response.status === 200) {
          setIsSuccess(true);
        } else if (response.status === 422) {
          setIsSuccess(true);
          setIsAlreadyVerified(true);
        } else {
          setIsSuccess(false);
        }
      } catch (error) {
        setIsSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [reference]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!reference) {
    return <ErrorMessage />;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StatusMessage
        isSuccess={isSuccess}
        isAlreadyVerified={isAlreadyVerified}
      />
    </Suspense>
  );
};

export default StatusPage;
