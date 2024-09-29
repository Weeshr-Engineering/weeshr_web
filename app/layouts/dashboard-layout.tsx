import React, { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
// import { Toaster } from "@/components/ui/toaster";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col w-full">
        {/* Use the new Header component here */}
        {/* <Header /> */}

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            className="flex flex-col flex-1 gap-4 p-6 lg:gap-10 lg:p-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.main>
          {/* <Toaster /> */}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardLayout;
