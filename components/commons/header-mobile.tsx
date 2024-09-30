"use client";

import { useState } from "react";
import { Fade as Hamburger } from "hamburger-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { navigationLinks } from "@/lib/constants/navigation-items"; // Import the navigation links
import { cn } from "@/lib/utils";

export default function HeaderMobile() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="flex items-center justify-between border-gray-400 py-8 lg:py-0">
      <a href="/">
        <Image
          alt="Weeshr Logo"
          src="https://res.cloudinary.com/drykej1am/image/upload/v1704590604/j7aiv2jdwuksre2bpclu.png"
          width={80}
          height={50}
          className="ml-2 absolute top-10 lg:top-14 md:w-24 "
          priority
        />
      </a>
      <nav>
        <section className="MOBILE-MENU flex lg:hidden">
          <div className="HAMBURGER-ICON bg-white rounded-lg mr-2">
            <Hamburger toggled={isNavOpen} toggle={setIsNavOpen} size={18} />
          </div>

          <AnimatePresence>
            {isNavOpen && (
              <motion.div
                className="showMenuNav"
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.3 }}
              >
                <div className="CLOSE-ICON absolute top-0 right-0 pr-4 py-8 ">
                  <Hamburger toggled={isNavOpen} toggle={setIsNavOpen} />
                </div>
                <ul className="MENU-LINK-MOBILE-OPEN flex flex-col items-center justify-between min-h-[250px] -mt-52">
                  {navigationLinks.map((link) => (
                    <li
                      key={link.link}
                      className={`border-b border-gray-400 my-6 uppercase ${
                        link.disabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Button
                        asChild
                        variant={"link"}
                        size={"lg"}
                        className="hover:no-underline"
                      >
                        {link.disabled ? (
                          <span>{link.name}</span> // Render as text if disabled
                        ) : (
                          <Link
                            href={link.link} // Correct the prop from 'link' to 'href'
                            onClick={() => setIsNavOpen(false)}
                          >
                            {link.name}
                          </Link>
                        )}
                      </Button>
                    </li>
                  ))}

                  <button
                    disabled
                    className={cn(
                      "border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] px-10 py-2 rounded-full text-neutral-500 mt-6"
                    )}
                  >
                    <span>Login</span>
                    <span className="absolute inset-x-0 w-1/2 h-px mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                  </button>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </nav>

      <style>{`
        .hideMenuNav {
          display: none;
        }
        .showMenuNav {
          position: absolute;
          width: 100%;
          height: 100vh;
          top: 0;
          left: 0;
          background: white;
          z-index: 10;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
