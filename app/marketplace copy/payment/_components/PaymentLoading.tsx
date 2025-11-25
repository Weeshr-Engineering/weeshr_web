"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function PaymentLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white rounded-[32px] shadow-xl border-none overflow-hidden">
        <CardContent className="p-8 text-center">
          {/* Loading Animation */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 border-4 border-[#3E68FF] border-t-transparent rounded-full animate-spin"></div>
          </div>

          {/* Loading Message */}
          <CardHeader className="text-center space-y-4 px-0">
            <h1 className="text-2xl font-bold text-gray-800">
              Verifying Payment
            </h1>
            <p className="text-gray-600 text-sm">
              Please wait while we confirm your payment details...
            </p>
          </CardHeader>

          {/* Progress Bar */}
          <div className="mt-6 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#3E68FF] h-2 rounded-full animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
