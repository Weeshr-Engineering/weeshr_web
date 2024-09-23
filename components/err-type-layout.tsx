// components/err-type-layout

import Footer from "@/components/footer_payment";
import Header from "@/components/header_payment";
import InterfaceLayout from "@/components/Interface-layout";
import WidthLayout from "@/components/width-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ReactNode } from "react";

interface ErrTypeLayoutProps {
  children: ReactNode;
}

export const ErrTypeLayout: React.FC<ErrTypeLayoutProps> = ({ children }) => {
  return (
    <InterfaceLayout>
      <div className="w-4/5 mx-auto flex items-center justify-center  h-44">
        <Header />
      </div>
      <WidthLayout narrow={true}>
        <div className="w-full m-auto flex items-center justify-center">
          <main className="flex flex-col items-center mb-14 w-full max-w-md  justify-center md:w-[28rem] lg:w-full lg:flex lg:max-w-[910px] lg:bg-white bg-background lg:flex-nowrap md:p-6 pt-0 md:pt-6 lg:p-0 rounded-2xl lg:flex-row">
            <div className="flex flex-col items-center justify-center w-full my:mb-[10rem] mt-mb-[3rem]">
              {children}
            </div>
          </main>
        </div>
      </WidthLayout>
      <Footer />
    </InterfaceLayout>
  );
};
