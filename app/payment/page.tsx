"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { PaymentLayout } from "./_component/payment-type-layout";
import { verify } from "crypto";

interface StatusMessageProps {
  isSuccess: boolean;
  isAlreadyVerified?: boolean;
  userMessage?: string;
  firstName?: string;
  lastName?: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({
  isSuccess,
  isAlreadyVerified,
  userMessage,
  firstName,
  lastName,
}) => {
  const handleClose = () => {
    if (window.parent) {
      window.parent.postMessage("closeIframe", "*");
    }
  };

  if (isAlreadyVerified) {
    return (
      <PaymentLayout>
        <div className="w-full pt-4 mb-12 h-full justify-center items-center flex flex-col">
          <div className="lg:mt-12 my-0 relative h-80 lg:h-96 w-4/5 md:w-3/5">
            <Image
              fill
              className="rounded-sm shadow-xs absolute object-contain"
              src='/approved.png'
              alt="Already Verified"
              priority
            />
          </div>
          <h2 className="text-2xl mb-1  w-full text-center text-[#020721]">
            Payment Already Verified!
          </h2>
          <p className="text-center mb-5 md:mb-3  text-muted-foreground">
            {userMessage || "This payment has already been verified."}
          </p>
          <Link href="https://weeshr.com/" passHref>
            <Button
              size={"customTet"}
              className="md:my-4 lg:my-2  min-w-72 bg-[#34389B] rounded-full"
            >
              Go Home
            </Button>
          </Link>
        </div>
      </PaymentLayout>
    );
  }

  if (isSuccess) {

    return (
      <PaymentLayout>
        <div className="w-full pt-4 mb-12 h-full justify-center items-center flex flex-col">
          <div className="lg:mt-12 my-0 relative h-80 lg:h-96 w-4/5 md:w-3/5">
            <Image
              fill
              className="rounded-sm shadow-xs absolute object-contain"
              alt="Payment Successful"
              src='/success.png'
            />
          </div>
          <h2 className="text-2xl mb-1  w-full text-center text-[#020721]">
            Payment Successful
          </h2>
          <p className="text-center mb-5 md:mb-3  text-muted-foreground">
            {userMessage ||
              `You have successfully contributed ${firstName && lastName
                ? `towards ${firstName} ${lastName}’s weeshes`
                : "towards this weesh."
              }`}
          </p>
          <Button
            className="md:my-4 lg:my-2  min-w-72 bg-[#34389B] rounded-full"
          >
            <Link href="https://weeshr.com/"> Go Home</Link>
          </Button>
        </div>
      </PaymentLayout>
    );
  } else {
    return (
      <PaymentLayout>
        <div className="w-full pt-4 mb-12 h-full justify-center items-center flex flex-col">
          <div className="lg:mt-12 my-0 relative h-80 lg:h-96 w-4/5 md:w-3/5">
            <Image
              fill
              className="rounded-sm shadow-xs absolute object-contain bg-blend-overlay"
              alt="Payment Failed"
              src='/failed.png'
            />
          </div>
          <h2 className="text-2xl mb-2 pt-10 w-full text-center text-[#020721] ">
            Payment Failed
          </h2>
          <p className="text-center mb-8 text-muted-foreground">
            There was an issue with your payment. <br />
            Please try again
          </p>
          <Button
            className="w-full mb-3 max-w-72 bg-[#34389B] rounded-full"
            onClick={() => window.history.go(-2)}
          >
            Retry Payment
          </Button>
          <Link href="https://weeshr.com/" passHref>
            <Button
              variant="outline"
              size={"customTet"}
              className=" rounded-full border-[#020721] text-[#020721]"
            >
              View Weeshes
            </Button>
          </Link>
        </div>
      </PaymentLayout>
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

  const [firstName, setFirstName] = useState<string | undefined>(undefined);
  const [lastName, setLastName] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!reference || loading === false) {
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payments/transaction/verify/${reference}`
        );

        const responseData = await response.json();

        // console.log("Response Status: ", response.status);
        // console.log("Response Data: testing ");

        if (
          response.status === 200 &&
          responseData.data?.data?.metadata?.user
        ) {
          const user = responseData.data.data.metadata.user;

          const { firstName = "", lastName = "" } = user;
          setFirstName(firstName);
          setLastName(lastName);

          setUserMessage(
            `You have successfully contributed toward ${firstName} ${lastName}’s  Weeshes`
          );

          setIsSuccess(true);
        } else if (response.status === 422) {
          setIsAlreadyVerified(true);
          setUserMessage(
            responseData.message || "This payment has already been verified."
          );
        } else {
          setIsSuccess(false);
        }
      } catch (error) {
        console.error("Error verifying payment: ", error);
        setIsSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [reference, loading]); // Dependency array

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
      firstName={firstName}
      lastName={lastName}
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
