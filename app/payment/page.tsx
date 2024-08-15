"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ErrTypeLayout } from "@/components/err-type-layout";

interface StatusMessageProps {
  isSuccess: boolean;
  isAlreadyVerified?: boolean;
  userMessage?: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({
  isSuccess,
  isAlreadyVerified,
  userMessage,
}) => {
  const handleClose = () => {
    if (window.parent) {
      window.parent.postMessage("closeIframe", "*");
    }
  };

  if (isSuccess) {
    return (
      <ErrTypeLayout>
        <div className="w-full h-full justify-center items-center flex flex-col">
          <div className="mb-8 relative h-80 lg:h-52  lg:64  w-4/5 md:w-3/5">
            <Image
              fill
              className="rounded-sm shadow-xs absolute object-contain"
              src="https://res.cloudinary.com/dufimctfc/image/upload/v1722990518/success2_lv7tnt.svg"
              alt="Payment Successful"
            />
          </div>
          <h2 className="text-2xl mb-2 pt-10 w-full text-center text-[#020721]">
            {isAlreadyVerified ? "Hurray!!!":"Payment"}
          </h2>
          <p className="text-center mb-8 text-muted-foreground">
          {userMessage || "You have successfully contributed towards weeshes"}  
                  </p>
          <Button className="w-full mb-3 max-w-72 bg-[#34389B] rounded-full">
            <Link href="https://weeshr.com/"> Go Home</Link>
          </Button>
          <Button variant="outline" className="w-full max-w-72 rounded-full border-[#020721] text-[#020721]">
            <Link href="https://weeshr.com/">Download App</Link>
          </Button>
        </div>
      </ErrTypeLayout>
    );
  } else {
   
    return (
      <ErrTypeLayout>
        <div className="w-full h-full justify-center items-center flex flex-col">
          <div className="mb-8 relative h-80 lg:h-52  lg:64  w-4/5 md:w-3/5">
            <Image
              fill
              className="rounded-sm shadow-xs absolute object-contain"
              src="https://res.cloudinary.com/dufimctfc/image/upload/v1720680326/payment_failed_ro0qx3.svg"
              alt="Payment Failed"
            />
          </div>
          <h2 className="text-2xl mb-2 pt-10 w-full text-center text-[#020721] ">
            Payment Failed
          </h2>
          <p className="text-center mb-8 text-muted-foreground">
            There was an issue with your payment. <br/>Please try again
          </p>
          <Button className="w-full mb-3 max-w-72 bg-[#34389B] rounded-full">
            <Link href="https://weeshr.com/"> Retry Payment</Link>
          </Button>
          <Button variant="outline" className="w-full max-w-72 rounded-full border-[#020721] text-[#020721]">
            <Link href="https://weeshr.com/">View Weeshes</Link>
          </Button>
        </div>
      </ErrTypeLayout>
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

const StatusClient = () => {
  const searchParams = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userMessage, setUserMessage] = useState<string | undefined>(undefined);
  const reference = searchParams.get("reference");

  useEffect(() => {
    if (!reference) {
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payments/transaction/verify/${reference}`
        );
        if (response.status === 200) {
          setIsSuccess(true);
          // Fetch user-specific message
          const userName = "exampleUserName"; // Replace with actual logic to fetch username
          const year = new Date().getFullYear(); // Or fetch dynamically if needed
          const userResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/public/webpage/${userName}/${year}`
                      );
          const userData = await userResponse.json();
          console.log('Fetched User Data:', userData);
          setUserMessage(
            `You have successfully contributed toward ${userData.userName}’s weeshes`
          );
          console.log('User Message:', userMessage);
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
    <StatusMessage
      isSuccess={isSuccess}
      isAlreadyVerified={isAlreadyVerified}
      userMessage={userMessage}
    />
  );
};

const StatusPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StatusClient />
    </Suspense>
  );
};

export default StatusPage;
