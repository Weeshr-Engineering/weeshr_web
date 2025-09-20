"use client";

import { FloatingNav } from "@/components/commons/floating-navbar";
import Footer from "../../../marketplace/_components/footer";
import HeaderMobile from "@/components/commons/header-mobile";
import WidthLayout from "@/components/commons/width-layout";
import { marketplaceLinks } from "@/lib/constants/navigation-items";
import { usePathname, useSearchParams } from "next/navigation";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // preserve query string (e.g. ?name=Joker)
  const queryString = searchParams.toString();
  const querySuffix = queryString ? `?${queryString}` : "";

  // rebuild nav links with query
  const navWithQuery = marketplaceLinks.map((item) => ({
    ...item,
    link: `${item.link}${querySuffix}`,
  }));

  return (
    <main
      className="relative flex flex-col min-h-screen bg-cover bg-top bg-no-repeat
    bg-[url('https://res.cloudinary.com/drykej1am/image/upload/v1757840432/weeshr-marketplace/Desktop_-_20_pleoi7.png')]"
    >
      <WidthLayout>
        <HeaderMobile hideLoginButton={true} customLinks={navWithQuery} />
        <FloatingNav navItems={navWithQuery} showLoginButton={false} />
      </WidthLayout>

      <div className="flex-grow">{children}</div>

      <Footer />
    </main>
  );
};

export default LandingLayout;
