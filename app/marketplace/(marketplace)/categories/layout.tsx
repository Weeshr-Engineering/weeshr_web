import { FloatingNav } from "@/components/commons/floating-navbar";
import Footer from "../../../marketplace/_components/footer";
import HeaderMobile from "@/components/commons/header-mobile";
import WidthLayout from "@/components/commons/width-layout";
import { marketplaceLinks } from "@/lib/constants/navigation-items"; // Import the navigation links

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main
      className="relative flex flex-col min-h-screen bg-cover bg-top bg-no-repeat
    bg-[url('https://res.cloudinary.com/drykej1am/image/upload/v1757840432/weeshr-marketplace/Desktop_-_20_pleoi7.png')]"
    >
      <WidthLayout>
        <HeaderMobile hideLoginButton={true} customLinks={marketplaceLinks} />
        <FloatingNav navItems={marketplaceLinks} showLoginButton={false} />
      </WidthLayout>

      <div className="flex-grow">{children}</div>

      <Footer />
    </main>
  );
};

export default LandingLayout;
