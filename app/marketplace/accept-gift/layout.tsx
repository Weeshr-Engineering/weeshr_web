"use client";

import HeaderMobile from "@/components/commons/header-mobile";
import Footer from "@/components/commons/footer-primary";
import Header from "@/app/payment/_component/header_payment";

export default function AcceptGiftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Header */}

      {/* Page content */}
      <div className="flex-grow">{children}</div>

      <div className=" md:hidden">
        <Footer />
      </div>
    </main>
  );
}
