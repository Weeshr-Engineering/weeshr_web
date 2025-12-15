import { FloatingNav } from "@/components/commons/floating-navbar";
import Footer from "@/components/commons/footer-primary";
import HeaderMobile from "@/components/commons/header-mobile";
import WidthLayout from "@/components/commons/width-layout";
import { navigationLinks } from "@/lib/constants/navigation-items"; // Import the navigation links

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main
      className="relative overflow-auto  h-screen bg-cover bg-top bg-no-repeat 
        bg-[url('https://res.cloudinary.com/drykej1am/image/upload/v1757702126/weeshr-marketplace/Desktop_-_19_jcvfpg.png')]"
    >
      {children}
    </main>
  );
};

export default LandingLayout;
