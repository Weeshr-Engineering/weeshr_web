"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="p-6 bg-white md:mx-auto">
          <svg
            viewBox="0 0 24 24"
            className="w-16 h-16 mx-auto my-6 text-green-600"
          >
            <path
              fill="currentColor"
              d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
            ></path>
          </svg>
          <div className="text-center">
            <h3 className="text-base font-semibold text-center text-gray-900 md:text-2xl">
              {isAlreadyVerified
                ? "Payment Already Verified!"
                : "Payment Done!"}
            </h3>
            <p className="my-2 text-gray-600">
              {isAlreadyVerified
                ? "This payment has already been verified."
                : "Thank you for completing your secure online payment."}
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
  } else {
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
              Payment Failed!
            </h3>
            <p className="my-2 text-gray-600">
              There was an issue with your payment. Please try again.
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
    <StatusMessage
      isSuccess={isSuccess}
      isAlreadyVerified={isAlreadyVerified}
    />
  );
};

export default StatusPage;
