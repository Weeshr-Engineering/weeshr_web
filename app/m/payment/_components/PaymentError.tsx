"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

interface PaymentErrorProps {
  error: string;
}

export default function PaymentError({ error }: PaymentErrorProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-white/40 backdrop-blur-2xl">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-[32px] shadow-xl border-none overflow-hidden flex flex-col items-center justify-center py-10 relative">
        <CardContent className="p-8 text-center w-full">
          {/* Error Image */}
          <div className="flex justify-center mb-6">
            <div className="relative h-48 w-48">
              <Image
                fill
                className="object-contain"
                src="/failed.svg"
                alt="Payment Failed"
                priority
              />
            </div>
          </div>

          {/* Error Message */}
          <CardHeader className="text-center space-y-3 px-0 pb-6">
            <h1 className="text-2xl font-bold text-[#020721]">
              Payment Failed
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              {error}
              <br />
              <span className="text-gray-500">Please try again</span>
            </p>
          </CardHeader>

          {/* Actions */}
          <div className="space-y-3 w-full">
            <Button
              className="w-full rounded-xl bg-[#3E68FF] text-white hover:bg-[#2d5aff] transition h-12 font-medium"
              onClick={() => window.history.back()}
            >
              Retry Payment
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 transition h-12 font-medium"
              onClick={() => (window.location.href = "/marketplace")}
            >
              Back to Marketplace
            </Button>
          </div>

          {/* Support Info */}
          <div className="mt-6 p-4 bg-[#F6F7FF] rounded-xl">
            <p className="text-xs text-gray-600">
              Need help? Contact our support team at{" "}
              <a
                href="mailto:support@weeshr.com"
                className="text-[#3E68FF] hover:underline font-medium"
              >
                support@weeshr.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
