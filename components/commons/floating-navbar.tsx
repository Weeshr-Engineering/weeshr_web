"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
    disabled?: boolean; // Add disabled prop
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [isScrollable, setIsScrollable] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkScrollable = () => {
      setIsScrollable(
        document.documentElement.scrollHeight > window.innerHeight
      );
    };

    const checkAuthentication = () => {
      setIsAuthenticated(!!localStorage.getItem("authToken"));
    };

    checkScrollable();
    checkAuthentication();

    window.addEventListener("resize", checkScrollable);

    return () => {
      window.removeEventListener("resize", checkScrollable);
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number" && isScrollable) {
      let direction = current - scrollYProgress.getPrevious()!;

      setVisible(true);
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    router.push("/login");
  };

  const showLogout = pathname === "/account";
  const showAccount = isAuthenticated && pathname !== "/account";

  return (
    <AnimatePresence mode="wait">
      <div className=" justify-around hidden lg:flex">
        <motion.div
          initial={{
            opacity: 1,
            y: -100,
          }}
          animate={{
            y: visible ? 0 : -100,
            opacity: visible ? 1 : 0,
          }}
          transition={{
            duration: 0.2,
          }}
          className={cn(
            "flex md:w-[40%] max-w-md  fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-6 py-2 items-center justify-between space-x-4",
            className
          )}
        >
          <div className="flex gap-4 w-full  justify-between">
            {navItems.map((navItem, idx) => (
              <Link
                key={`link=${idx}`}
                href={navItem.link}
                className={cn(
                  "relative items-center flex space-x-1",
                  pathname === navItem.link
                    ? "text-black"
                    : "text-neutral-500 hover:text-black"
                )}
              >
                <span className="block sm:hidden">{navItem.icon}</span>
                <span className="text-sm sm:block">{navItem.name}</span>
              </Link>
            ))}

            {/* Disable Login and Account Buttons */}
            {showLogout ? (
              <button
                onClick={handleLogout}
                className={cn(
                  "border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] px-4 py-2 rounded-full",
                  "bg-red-100 text-red-800"
                )}
                disabled // Disable the logout button
              >
                <span>Logout</span>
                <span className="absolute inset-x-0 w-1/2 h-px mx-auto -bottom-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
              </button>
            ) : showAccount ? (
              <button
                className={cn(
                  "border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] px-4 py-2 rounded-full text-neutral-500"
                )}
                disabled // Disable the account button
              >
                <span>Account</span>
                <span className="absolute inset-x-0 w-1/2 h-px mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              </button>
            ) : (
              <button
                className={cn(
                  "border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] px-4 py-2 rounded-full text-neutral-500"
                )}
                disabled // Disable the login button
              >
                <span>Login</span>
                <span className="absolute inset-x-0 w-1/2 h-px mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
