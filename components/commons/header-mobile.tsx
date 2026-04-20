"use client";

import { useEffect, useState, useRef } from "react";
import { Fade as Hamburger } from "hamburger-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { navigationLinks } from "@/lib/constants/navigation-items";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import LoginDialog from "@/app/m/(marketplace)/categories/_components/LoginDialog";

interface HeaderMobileProps {
  hideLoginButton?: boolean;
  customLinks?: { name: string; link: string; disabled?: boolean }[];
}

export default function HeaderMobile({
  hideLoginButton = false,
  customLinks = navigationLinks, // fallback to default navigation
}: HeaderMobileProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    
    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    router.push("/m");
  };

  const handleLogin = () => {
    setLoginDialogOpen(true);
  };

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("authToken"));
  }, []);

  const showLogout = pathname === "/m";
  const showAccount = isAuthenticated && pathname !== "/m";
  const showLogin =
    !hideLoginButton && !isAuthenticated && !showLogout && !showAccount;

  return (
    <div className="flex items-center justify-between border-gray-400 py-6 lg:py-0 relative z-20 px-2">
      <a href="/">
        <Image
          alt="Weeshr Logo"
          src="https://res.cloudinary.com/drykej1am/image/upload/v1704590604/j7aiv2jdwuksre2bpclu.png"
          width={80}
          height={50}
          className="ml-2 md:w-24"
          priority
        />
      </a>

      <div className="flex items-center gap-2 pr-4 z-50">
        {!hideLoginButton && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={isAuthenticated ? () => setShowProfileMenu(!showProfileMenu) : handleLogin}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group focus:outline-none"
            >
              {isAuthenticated ? (
                <div className="w-full h-full rounded-full bg-gradient-custom flex items-center justify-center text-white">
                  <Icon icon="solar:user-bold" className="w-5 h-5" />
                </div>
              ) : (
                <Icon icon="solar:user-circle-linear" className="w-6 h-6 text-gray-500 group-hover:text-primary transition-colors" />
              )}
            </button>

            <AnimatePresence>
              {showProfileMenu && isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 mt-1 w-36 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                >
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }} 
                    className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <Icon icon="solar:logout-2-bold" className="w-5 h-5" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* <nav>
          <section className="MOBILE-MENU flex lg:hidden">
            <div className="HAMBURGER-ICON bg-white rounded-lg opacity-0 pointer-events-none">
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
                <div className="CLOSE-ICON absolute top-0 right-0 pr-4 py-8">
                  <Hamburger toggled={isNavOpen} toggle={setIsNavOpen} />
                </div>
                <ul className="MENU-LINK-MOBILE-OPEN flex flex-col items-center justify-between min-h-[250px] -mt-52">
                  {customLinks.map((link) => (
                    <li
                      key={link.link}
                      className={`mb-10 border-b border-gray-400 my-6 uppercase ${
                        link.disabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Button
                        asChild
                        variant="link"
                        size="lg"
                        className="hover:no-underline"
                      >
                        {link.disabled ? (
                          <span>{link.name}</span>
                        ) : (
                          <Link
                            href={link.link}
                            onClick={() => setIsNavOpen(false)}
                          >
                            {link.name}
                          </Link>
                        )}
                      </Button>
                    </li>
                  ))}

                  {showLogout ? (
                    <button
                      onClick={handleLogout}
                      className={cn(
                        "border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] px-4 py-2 rounded-full",
                        "bg-red-100 text-red-800"
                      )}
                    >
                      <span>Logout</span>
                      <span className="absolute inset-x-0 w-1/2 h-px mx-auto -bottom-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                    </button>
                  ) : showAccount ? (
                    <Link href="/m">
                      <button
                        className={cn(
                          "border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] px-4 py-2 rounded-full text-neutral-500"
                        )}
                      >
                        <span>Account</span>
                        <span className="absolute inset-x-0 w-1/2 h-px mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                      </button>
                    </Link>
                  ) : showLogin ? (
                    <button
                      onClick={handleLogin}
                      className={cn(
                        "border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] px-4 py-2 rounded-full text-neutral-500"
                      )}
                    >
                      <span>Login</span>
                      <span className="absolute inset-x-0 w-1/2 h-px mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                    </button>
                  ) : null}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </nav> */}
      </div>

      <LoginDialog
        open={loginDialogOpen}
        setOpen={setLoginDialogOpen}
        basketTotal={0}
        basketCount={0}
        basket={[]}
        products={[]}
        onLoginSuccess={() => {
          setLoginDialogOpen(false);
          setIsAuthenticated(true);
        }}
      />

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
