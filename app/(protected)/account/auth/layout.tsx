import Image from "next/image";
import { motion } from "framer-motion";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full overflow-auto overflow-x-hidden bg-white">
      <div>{children}</div>
    </main>
  );
};

export default Layout;
