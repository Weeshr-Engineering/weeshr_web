"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vendor } from "@/service/vendor.service";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import Link from "next/link";
import toast from "react-hot-toast";
import { MARKETPLACE_BACKGROUND_IMAGES } from "../../constants";

interface LandingClientProps {
  vendor: Vendor;
}

export default function LandingClient({ vendor }: LandingClientProps) {
  const router = useRouter();
  const [receiverName, setReceiverName] = useState("");
  const [isGiftingMyself, setIsGiftingMyself] = useState(false);
  const [showEbunSoon, setShowEbunSoon] = useState(false);
  const [mobileBgLoaded, setMobileBgLoaded] = useState(false);
  const [desktopBgLoaded, setDesktopBgLoaded] = useState(false);
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    // Select random image on mount
    const randomImage =
      MARKETPLACE_BACKGROUND_IMAGES[
        Math.floor(Math.random() * MARKETPLACE_BACKGROUND_IMAGES.length)
      ];
    setBgImage(randomImage);

    // Safety timeout to ensure content is visible even if image onload hangs
    const timer = setTimeout(() => {
      setMobileBgLoaded(true);
      setDesktopBgLoaded(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const defaultPlaceholders = [
    "Enter receiver's name",
    "Gift someone special 🎁",
    "Type a friend's name...",
    "Who's the lucky person ? ✨",
    "Surprise someone today 🎉",
    "Add a name to start gifting",
    "Search for a loved one ❤️",
    "Who deserves a treat ? 🍫",
    "Enter a colleague's name 👔",
    "Make someone smile 😊",
  ];

  const selfGiftingPlaceholders = [
    "You entering your own name, ya dig? 😉",
    "Treat yourself, you deserve it! 👑",
    "Self-love is the best love ❤️",
    "Who's a good human? You are! 🌟",
    "Time for a little self-care ✨",
    "Adding yourself to the nice list 🎅",
    "Spoil yourself today! 🍫",
    "Your future self will thank you 🎁",
    "You're the lucky person today! 🍀",
    "Make yourself smile 😊",
  ];

  const handleSubmit = (e?: React.FormEvent, nameOverride?: string) => {
    e?.preventDefault();
    const finalName = (nameOverride || receiverName).trim();

    if (!finalName) {
      toast.error("Please enter a name");
      return;
    }

    if (finalName.length < 2) {
      toast.error("Name must be at least 2 characters long");
      return;
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(finalName)) {
      toast.error("Name can only contain letters and numbers");
      return;
    }

    // Slugify logic matching vendor-list.tsx
    const slug = vendor.slug || vendor.name.toLowerCase().replace(/\s+/g, "-");
    const category = vendor.category.toLowerCase();
    const categoryId = vendor.categoryId || "null";

    // Construct target URL
    const url = `/m/categories/${category}/${slug}?name=${encodeURIComponent(
      finalName,
    )}&categoryId=${categoryId}&vendorId=${vendor.id}`;

    router.push(url);
  };

  const handleGiftMyself = () => {
    const nextState = !isGiftingMyself;
    setIsGiftingMyself(nextState);
    setReceiverName("");
  };

  return (
    <div
      className="flex flex-col h-[100dvh] w-full overflow-hidden overscroll-none fixed inset-0
                pt-[env(safe-area-inset-top)]
                pb-[env(safe-area-inset-bottom)]"
    >
      {/* 📌 BACKGROUND WATERMARK TEXT */}
      <div className="hidden md:flex absolute md:top-[-5%] top-[-15%] left-0 right-0 overflow-hidden pointer-events-none select-none z-0 opacity-[0.03] whitespace-nowrap leading-none items-center">
        <h1 className="text-[18vw] font-black uppercase tracking-tighter text-[#0A0D14]">
          {vendor.name} • {vendor.name} • {vendor.name}
        </h1>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          📌 MOBILE VERSION — Figma-matched design
          ═══════════════════════════════════════════════════════════════ */}
      <div className="md:hidden flex flex-col h-full w-full relative overflow-hidden bg-[#F6F7F9]">
        {/* ── LAYER 1: Scrolling main image (continuous upward animation) ── */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            className="absolute w-full"
            style={{ top: 0, left: 0 }}
            initial={{ y: "0%" }}
            animate={{ y: "-50%" }}
            transition={{
              duration: 90,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            {/* Two copies stacked for seamless loop */}
            <Image
              src="/mainimage.png"
              alt="Gift products collage"
              width={430}
              height={932}
              className="w-full h-auto object-cover"
              priority
              onLoad={() => setMobileBgLoaded(true)}
              onError={() => setMobileBgLoaded(true)}
            />
            <Image
              src="/mainimage.png"
              alt="Gift products collage"
              width={430}
              height={932}
              className="w-full h-auto object-cover"
              priority
            />
          </motion.div>
        </div>

        {/* ── LAYER 2: Static gradient overlay ── */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <Image
            src="/gradient.png"
            alt="Gradient overlay"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* ── LAYER 3: Content (logo + card + bottom text) ── */}
        <div className="relative z-[2] flex flex-col h-full">
          {/* Vendor Collab Heading */}
          <div className="w-full flex items-center justify-center gap-3 pt-10 pb-2 shrink-0">
            <span className="text-[#0A0D14] text-[26px] font-bold tracking-tight">
              {vendor.name}
            </span>
            <span className="text-[#0A0D14] text-2xl font-light leading-none relative top-[1px]">
              ×
            </span>
            <Image
              src="https://res.cloudinary.com/drykej1am/image/upload/v1704590628/weeshr_website/c9jufgt5n7dm009cehr4.png"
              alt="Weeshr Logo"
              width={100}
              height={32}
              className="object-contain"
              priority
            />
          </div>

          {/* Spacer to push card to bottom area */}
          <div className="flex-1" />

          {/* ── Glass Card Section ── */}
          <motion.div
            className="px-4 pb-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* èbùn badge */}
            <div className="flex items-center justify-end mb-3 pr-1 relative z-20">
              <button
                onClick={() => {
                  setShowEbunSoon(true);
                  setTimeout(() => setShowEbunSoon(false), 2000);
                }}
                className="bg-[#EAECE1]/90 backdrop-blur-md text-[#6A70FF] text-[13px] px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all duration-300 active:scale-95"
              >
                <AnimatePresence mode="wait">
                  {showEbunSoon ? (
                    <motion.span
                      key="soon"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="font-medium px-1"
                    >
                      Coming soon
                    </motion.span>
                  ) : (
                    <motion.div
                      key="ebun"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex items-center gap-1"
                    >
                      èbùn{" "}
                      <Icon
                        icon="lucide:sparkles"
                        className="w-3.5 h-3.5 fill-current"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>

            <Card className="backdrop-blur-2xl bg-[rgba(255,255,255,0.85)] shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-3xl border border-white/60 relative z-10">
              <CardHeader className="px-5 pt-5 pb-3">
                <CardTitle className="text-xl text-[#0A0D14] text-left p-0">
                  <span className="relative text-[#0A0D14] pr-1 font-normal">
                    Who would you like to
                    <span
                      className="relative whitespace-nowrap px-2 bg-gradient-custom bg-clip-text text-transparent text-xl sm:text-xl"
                      style={{
                        fontFamily:
                          "var(--font-playwrite), 'Playwrite CU', cursive, sans-serif",
                      }}
                    >
                      gift?
                    </span>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3 pt-0">
                <PlaceholdersAndVanishInput
                  placeholders={
                    isGiftingMyself
                      ? selfGiftingPlaceholders
                      : defaultPlaceholders
                  }
                  onChange={(e) => setReceiverName(e.target.value)}
                  onSubmit={handleSubmit}
                  value={receiverName}
                />

                {/* Gift Myself Checkbox */}
                <div className="flex justify-left mt-2 pl-1">
                  <button
                    type="button"
                    onClick={handleGiftMyself}
                    className="group flex items-center gap-2 px-1 py-1 rounded-full transition-all duration-300 ease-out"
                  >
                    <div className="w-5 h-5 rounded border-2 border-[#6A70FF] flex items-center justify-center bg-[#6A70FF]/10 relative overflow-hidden transition-colors duration-300">
                      <AnimatePresence>
                        {isGiftingMyself && (
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0, pathLength: 0 }}
                            animate={{ scale: 1, opacity: 1, pathLength: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 25,
                            }}
                            className="bg-[#6A70FF] absolute inset-0 flex items-center justify-center"
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.1 }}
                            >
                              <Icon
                                icon="lucide:check"
                                className="w-3.5 h-3.5 text-white"
                              />
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <span
                      className={`text-[14px] transition-all duration-300 inline-flex items-center h-8 ${
                        isGiftingMyself
                          ? "bg-gradient-custom bg-clip-text text-transparent font-normal overflow-visible"
                          : "font-medium text-[#0A0D14]/70 group-hover:text-[#0A0D14]"
                      }`}
                      style={{
                        fontFamily: isGiftingMyself
                          ? "var(--font-playwrite), 'Playwrite CU', cursive, sans-serif"
                          : "inherit",
                        lineHeight: "normal",
                      }}
                    >
                      I am gifting myself
                    </span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Start Here indicator */}
            <div className="absolute right-1 -bottom-4 md:relative md:bottom-auto md:right-auto md:mt-1 flex items-start justify-end pr-24 z-30 pointer-events-none">
              <span
                className="whitespace-nowrap text-[17px] mt-6"
                style={{
                  fontFamily:
                    "var(--font-playwrite), 'Playwrite CU', cursive, sans-serif",
                  color: "#6A70FF",
                }}
              >
                Start here
              </span>
              <Image
                src="/arrow.png"
                alt="Pointer Arrow"
                width={42}
                height={42}
                className="absolute -top-[2rem] right-[2.5rem] md:static md:top-auto md:right-auto md:ml-2"
              />
            </div>
          </motion.div>

          {/* ── Bottom tagline ── */}
          <motion.div
            className="w-full flex items-baseline justify-center px-4 py-4 pt-6 gap-x-1.5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="whitespace-nowrap text-xl bg-gradient-custom bg-clip-text text-transparent transform translate-y-1"
              style={{
                fontFamily:
                  "var(--font-playwrite), 'Playwrite CU', cursive, sans-serif",
              }}
            >
              Surprise
            </span>
            <span className="whitespace-nowrap text-white text-sm font-medium transform translate-y-[0.2rem]">
              the ones you love, send them a gift
            </span>
          </motion.div>
        </div>
      </div>

      {/* 📌 DESKTOP VERSION */}
      <div className="hidden md:flex min-h-screen flex-row">
        {/* Left Image Section */}
        <motion.div
          className="relative flex-1 m-6 shadow-[0_32px_64px_-20px_rgba(0,0,0,0.2)] rounded-3xl"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Shimmer skeleton while loading */}
          {!desktopBgLoaded && (
            <div className="absolute inset-0 bg-gray-100 rounded-3xl animate-shimmer z-10" />
          )}

          <motion.div
            initial={{ opacity: 0, scale: 1.01 }}
            animate={{
              opacity: desktopBgLoaded ? 1 : 0,
              scale: desktopBgLoaded ? 1 : 1.01,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            className="w-full h-full"
          >
            {bgImage && (
              <>
                <Image
                  src={bgImage}
                  alt="Vendor Background"
                  fill
                  className="object-cover rounded-3xl"
                  priority
                  sizes="50vw"
                  onLoad={() => setDesktopBgLoaded(true)}
                  onError={() => setDesktopBgLoaded(true)}
                  unoptimized={
                    typeof bgImage === "string" &&
                    bgImage.includes("getorielle.com")
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-3xl pointer-events-none" />
              </>
            )}
          </motion.div>
          <motion.div
            className="absolute bottom-6 left-6 right-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-3xl font-semibold">
              <span
                className="relative whitespace-nowrap px-2 bg-gradient-custom bg-clip-text text-transparent text-xl sm:text-3xl pb-8"
                style={{
                  fontFamily:
                    "var(--font-playwrite), 'Playwrite CU', cursive, sans-serif",
                }}
              >
                Surprise
              </span>
            </p>
            <p className="text-2xl">the ones you love,</p>
            <p className="text-2xl">send them a gift</p>
          </motion.div>
        </motion.div>

        {/* Right Content Section */}
        <motion.div
          className="flex flex-1 flex-col items-center justify-center p-6 md:pb-40 relative pt-36"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Subtle Sparkles */}
          <motion.div
            animate={{ opacity: [0.1, 0.4, 0.1], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] right-[30%] w-2 h-2 rounded-full bg-[#BAEF23] blur-[1px] hidden lg:block"
          />
          <motion.div
            animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.5, 1] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-[30%] left-[20%] w-3 h-3 rounded-full bg-[#6A70FF] blur-[2px] hidden lg:block"
          />
          <motion.div
            animate={{ opacity: [0.1, 0.2, 0.1], scale: [1.2, 0.8, 1.2] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute top-[60%] right-[10%] w-1.5 h-1.5 rounded-full bg-white blur-[1px] hidden lg:block"
          />

          {/* Squiggly SVG Decorations */}
          <div className="absolute top-[30%] left-[10%] w-32 h-32 opacity-30 pointer-events-none hidden lg:block">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <motion.path
                d="M10,80 Q30,20 50,80 T90,20"
                fill="none"
                stroke="#BAEF23"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </svg>
          </div>

          <div className="absolute bottom-[10%] left-[5%] w-40 h-40 opacity-20 pointer-events-none hidden lg:block">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <motion.path
                d="M90,20 Q70,80 50,20 T10,80"
                fill="none"
                stroke="#6A70FF"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </svg>
          </div>

          {/* Centered Decorative Watermark Link */}

          <div className="flex flex-col items-center justify-center mb-6 space-y-4">
            <h2 className="text-3xl md:text-4xl f text-[#0A0D14] tracking-tight text-center">
              {vendor.name}
            </h2>
            <Icon icon="lucide:x" className="w-6 h-6 text-black" />
            <Image
              src="https://res.cloudinary.com/drykej1am/image/upload/v1704590628/weeshr_website/c9jufgt5n7dm009cehr4.png"
              alt="Weeshr Logo"
              width={130}
              height={42}
              priority
            />
          </div>
          <Card className="w-full max-w-sm bg-white/80 backdrop-blur-sm shadow-lg px-0 rounded-3xl bg-[#E9F4D1] border-none">
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-xl text-primary text-left p-0">
                <span className="relative text-primary pr-1 font-normal">
                  Who would you like to
                  <span
                    className="relative whitespace-nowrap px-2 bg-gradient-custom bg-clip-text text-transparent text-xl"
                    style={{
                      fontFamily:
                        "var(--font-playwrite), 'Playwrite CU', cursive, sans-serif",
                    }}
                  >
                    gift?
                  </span>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-1">
              <PlaceholdersAndVanishInput
                placeholders={
                  isGiftingMyself
                    ? selfGiftingPlaceholders
                    : defaultPlaceholders
                }
                onChange={(e) => setReceiverName(e.target.value)}
                onSubmit={handleSubmit}
                value={receiverName}
              />

              {/* Gift Myself Button - DESKTOP VERSION */}
              <div className="flex justify-left my-1 pl-3">
                <button
                  type="button"
                  onClick={handleGiftMyself}
                  className="group flex items-center gap-2 px-1 py-1 rounded-full transition-all duration-300 ease-out"
                >
                  <div className="w-6 h-6 rounded border-2 border-[#6A70FF] flex items-center justify-center bg-[#6A70FF]/10 relative overflow-hidden transition-colors duration-300">
                    <AnimatePresence>
                      {isGiftingMyself && (
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          }}
                          className="bg-[#6A70FF] absolute inset-0 flex items-center justify-center"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            <Icon
                              icon="lucide:check"
                              className="w-4 h-4 text-white"
                            />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <span
                    className={`text-[15px] transition-all duration-300 inline-flex items-center h-9 ${
                      isGiftingMyself
                        ? "bg-gradient-custom bg-clip-text text-transparent font-normal  overflow-visible"
                        : "font-medium text-primary/80 group-hover:text-primary"
                    }`}
                    style={{
                      fontFamily: isGiftingMyself
                        ? "var(--font-playwrite), 'Playwrite CU', cursive, sans-serif"
                        : "inherit",
                      lineHeight: "normal",
                    }}
                  >
                    I am gifting myself
                  </span>
                </button>
              </div>
            </CardContent>
          </Card>
          <div className="relative mt-4 items-center justify-end pr-3 hidden md:flex pl-[220px]">
            <span
              className="whitespace-nowrap text-xl mt-10"
              style={{
                fontFamily:
                  "var(--font-playwrite), 'Playwrite CU', cursive, sans-serif",
                color: "white",
              }}
            >
              Start here
            </span>
            <Image
              src="https://res.cloudinary.com/drykej1am/image/upload/v1763995414/weeshr-marketplace/Group_317_dxmhcs.png"
              alt="Pointer Arrow"
              width={32}
              height={32}
              className="ml-2"
            />
          </div>
          {/* 📌 DESKTOP START HERE INDICATOR */}
          <Link
            href="/"
            className="text-white font-medium text-2xl absolute bottom-20 hover:underline transition"
          >
            weeshr.com
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
