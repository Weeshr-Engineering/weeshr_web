"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import AddressModal from "./AddressModal";
import ResultModal from "./ResultModal";
import Header from "@/app/payment/_component/header_payment";
import { useRouter } from "next/navigation";

export default function AcceptGiftContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string>("");
  const [receiver, setReceiver] = useState<string>("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    const orderIdParam = searchParams.get("orderId");
    const receiverParam = searchParams.get("receiver");

    if (orderIdParam) setOrderId(orderIdParam);
    if (receiverParam) setReceiver(receiverParam);
  }, [searchParams]);

  const handleClaimGift = () => {
    setShowAddressModal(true);
  };

  const handleAddressSubmit = (success: boolean, message: string) => {
    setShowAddressModal(false);
    setIsSuccess(success);
    setResultMessage(message);
    setShowResultModal(true);
  };

  const handleResultClose = () => {
    setShowResultModal(false);

    // Redirect only on success
    if (isSuccess) {
      router.push("/m");
    }
  };

  return (
    <div className="min-h-screen w-full p-0 md:p-6 md:flex md:items-center md:justify-center bg-white/10 backdrop-blur-lg">
      <div className="w-full md:max-w-lg md:bg-white md:rounded-3xl md:shadow-2xl md:border md:border-gray-100 overflow-hidden">
        <div className="max-w-md mx-auto h-full flex flex-col p-4 md:p-8">
          <div className="md:hidden">
            <Header />
          </div>

          <main className="flex-1 flex flex-col items-center justify-center py-8 md:py-12">
            <div className="relative mb-8 md:mb-10 w-full max-w-[280px] md:max-w-[320px] aspect-square">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 rounded-3xl transform rotate-3 opacity-60"></div>
              <div className="absolute inset-0 bg-gradient-to-l from-pink-100 to-purple-100 rounded-3xl transform -rotate-3 opacity-60"></div>
              <div className="relative w-full h-full flex items-center justify-center p-6">
                <Image
                  src="https://res.cloudinary.com/drykej1am/image/upload/v1764594796/marketplace/gift-dynamic-premium_tfoied.png"
                  alt="Gift Box"
                  width={260}
                  height={260}
                  className="object-contain drop-shadow-2xl animate-float"
                  priority
                  quality={100}
                />
              </div>
              <div className="absolute top-0 -right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-20 blur-sm"></div>
              <div className="absolute bottom-6 -left-4 w-10 h-10 bg-pink-400 rounded-full opacity-20 blur-sm"></div>
            </div>

            <div className="text-center mb-10 md:mb-12 px-4">
              <h1 className="text-2xl md:text-3xl font-medium text-gray-900 mb-3 tracking-tight">
                A Gift Was Sent to You! 🎁
              </h1>
              <p className="text-gray-600 text-base md:text-lg mb-2">
                Someone special has sent you a surprise
              </p>
              <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200 mt-3">
                <Icon icon="mdi:account" className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 font-medium capitalize">
                  From {receiver || "a friend"}
                </span>
              </div>
            </div>

            <div className="w-full px-4 md:px-0">
              <Button
                onClick={handleClaimGift}
                className="w-full h-auto md:h-14 px-6 py-4 md:py-3 rounded-2xl bg-gradient-to-r from-[#4145A7] to-[#6A6FEB] hover:from-[#3639A0] hover:to-[#5A5FE5] text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="flex items-center justify-center gap-3">
                  <span>Claim Your Gift</span>
                  <Icon
                    icon="streamline-ultimate:shopping-basket-1"
                    className="w-5 h-5 md:w-6 md:h-6"
                  />
                </span>
              </Button>

              <p className="text-center text-gray-500 text-sm mt-4 px-2">
                You'll be asked to provide your shipping address to receive the
                gift
              </p>
            </div>
          </main>
        </div>
      </div>

      <AddressModal
        open={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        orderId={orderId}
        onSubmit={handleAddressSubmit}
      />

      <ResultModal
        open={showResultModal}
        onClose={handleResultClose}
        isSuccess={isSuccess}
        message={resultMessage}
      />
    </div>
  );
}
