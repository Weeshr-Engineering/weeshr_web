import { FloatingNav } from "@/components/commons/floating-navbar";
import Footer from "@/components/commons/footer-primary";
import HeaderMobile from "@/components/commons/header-mobile";
import WidthLayout from "@/components/commons/width-layout";
import { navigationLinks } from "@/lib/constants/navigation-items"; 
import Head from "next/head";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <meta name="zoho-verification" content="12047193" />
      </Head>
      <main className="relative overflow-auto overflow-x-hidden">
        <div
          className="bg-cover bg-top bg-no-repeat 
        bg-[url('https://res.cloudinary.com/drykej1am/image/upload/v1727678267/weeshr_website/Home_M-BG_bq1fnw.png')] 
        md:bg-[url('https://res.cloudinary.com/drykej1am/image/upload/v1727678040/weeshr_website/Home_W-BG_lshut6.png')]"
        >
          <WidthLayout>
            <HeaderMobile />
            <FloatingNav navItems={navigationLinks} />
          </WidthLayout>

          {children}

          <WidthLayout>
            <Footer />
          </WidthLayout>
        </div>
      </main>
    </>
  );
};

export default LandingLayout;
