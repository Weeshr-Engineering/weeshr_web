import Image from "next/image";
import { motion } from "framer-motion";
import { Head } from "react-day-picker";
import Header from "@/components/header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full overflow-auto overflow-x-hidden bg-white">
      {/* <Image
        alt="Weeshr Logo"
        src="https://res.cloudinary.com/drykej1am/image/upload/v1704590628/weeshr_website/c9jufgt5n7dm009cehr4.png"
        width={100}
        height={100}
        className="absolute mx-auto top-10 left-6"
      /> */}
      <Image
        height={"100"}
        width={"100"}
        alt="design"
        src={
          "https://res.cloudinary.com/drykej1am/image/upload/v1724057819/weeshr_website/Vector_173_eha0sp.png"
        }
        className="absolute right-0 object-cover md:hidden md:top-0"
      />
      <Image
        height={"300"}
        width={"250"}
        alt="design"
        src={
          "https://res.cloudinary.com/drykej1am/image/upload/v1724055329/weeshr_website/Vector_173_l188oi.png"
        }
        className="absolute right-0 hidden object-cover md:top-0 md:block"
      />

      <Image
        height={"200"}
        width={"350"}
        alt="design"
        src={
          "https://res.cloudinary.com/drykej1am/image/upload/v1724060577/weeshr_website/Logo_rlbykm.png"
        }
        className="absolute object-cover md:hidden -top-[10%] inset-0 m-auto w-full"
      />

      <Header />
      <div>{children}</div>
    </main>
  );
};

export default Layout;
