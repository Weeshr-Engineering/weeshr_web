import { ReactNode } from "react";
import InterfaceLayout from "./err-Interface-layout";
import WidthLayout from "@/components/commons/width-layout";
import Footer from "@/components/commons/footer-primary";

interface ErrTypeLayoutProps {
  children: ReactNode;
}

export const ErrTypeLayout: React.FC<ErrTypeLayoutProps> = ({ children }) => {
  return (
    <InterfaceLayout>
      <WidthLayout>
        <div className="w-full m-auto flex items-center justify-center ">
          <main className="flex flex-col items-center mb-5 w-full max-w-md  justify-center md:w-[28rem] lg:w-full lg:flex lg:max-w-[910px] bg-bg-[url('https://res.cloudinary.com/drykej1am/image/upload/v1727678040/weeshr_website/Home_W-BG_lshut6.png');]  lg:flex-nowrap md:p-6 pt-0 md:pt-6 lg:p-0 rounded-2xl lg:flex-row ">
            <div className="flex flex-col items-center justify-center w-full ">
              {children}
            </div>
          </main>
        </div>
        <Footer />
      </WidthLayout>
    </InterfaceLayout>
  );
};
