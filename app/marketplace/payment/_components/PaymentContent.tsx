// app/marketplace/payment/PaymentContent.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PaymentLoader from "./PaymentLoader";
import PaymentError from "./PaymentError";
import PaymentSuccess from "./PaymentSuccess";

interface PaymentData {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    currency: string;
    metadata: {
      cartId: string;
      receiverName: string;
      email: string;
      phoneNumber: string;
      shippingAddress: string;
      deliveryDate: string;
      totalAmount: string;
      itemCount: string;
    };
    customer: {
      email: string;
    };
  };
}

export default function PaymentContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) {
      setError("No payment reference found");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `https://api.staging.weeshr.com/api/v1/payments/transaction/verify/${reference}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (result.code === 200 && result.data.status) {
          setPaymentData(result.data);
        } else {
          setError(result.data?.message || "Payment verification failed");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setError("Failed to verify payment. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [reference]);

  if (loading) {
    return <PaymentLoader />;
  }

  if (error || !paymentData) {
    return <PaymentError error={error || "Payment verification failed"} />;
  }

  return (
    <PaymentSuccess
      paymentData={paymentData}
      receiverName={paymentData.data.metadata.receiverName}
      address={paymentData.data.metadata.shippingAddress}
      deliveryDate={paymentData.data.metadata.deliveryDate}
      phoneNumber={paymentData.data.metadata.phoneNumber}
    />
  );
}
