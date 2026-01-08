"use client";

interface PaymentLoaderProps {
  backgroundClass?: string;
  title?: string;
  message?: string;
}

export default function PaymentLoader({
  backgroundClass = "bg-white/40",
  title = "Verifying Payment",
  message = "Please wait while we confirm your payment details...",
}: PaymentLoaderProps) {
  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center p-4 ${backgroundClass} backdrop-blur-2xl relative`}
    >
      {/* Centered Loading Content - No Card Wrapper */}
      <div className="w-full max-w-md flex flex-col items-center justify-center py-10 text-center space-y-6">
        {/* Enhanced Loader Animation */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#3E68FF]/20 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-[#3E68FF] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
        </div>

        {/* Loading Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-[#3E68FF] rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-[#3E68FF] rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-[#3E68FF] rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
