// app/marketplace/payment/page.tsx
import { Suspense } from "react";
import PaymentLoader from "./_components/PaymentLoader";
import PaymentContent from "./_components/PaymentContent";

export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentLoader />}>
      <PaymentContent />
    </Suspense>
  );
}
