import Image from "next/image";
import { motion } from "framer-motion";
import { Head } from "react-day-picker";
import Header from "@/components/header";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full bg-gradient-to-br from-[] from-5% via-white  via-0.11% to-[E4E6F5] to-99.89% overflow-auto overflow-x-hidden">
      <Header />
      <div>{children}</div>
    </main>
  );
};

export default LandingLayout;
