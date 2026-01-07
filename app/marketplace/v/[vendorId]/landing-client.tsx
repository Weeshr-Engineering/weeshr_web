"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vendor } from "@/service/vendor.service";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import Link from "next/link";
import toast from "react-hot-toast";

interface LandingClientProps {
  vendor: Vendor;
}

export default function LandingClient({ vendor }: LandingClientProps) {
  const router = useRouter();
  const [receiverName, setReceiverName] = useState("");
  const [isGiftingMyself, setIsGiftingMyself] = useState(false);

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
    const slug = vendor.name.toLowerCase().replace(/\s+/g, "-");
    const category = vendor.category.toLowerCase();

    // Construct target URL
    const url = `/marketplace/categories/${category}/${slug}?name=${encodeURIComponent(
      finalName
    )}&categoryId=null&vendorId=${vendor.id}`;

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
      {/* 📌 MOBILE TOP LOGO */}
      <div className="w-full flex justify-center pt-6 pb-2 md:hidden shrink-0 z-10">
        <Image
          src="https://res.cloudinary.com/drykej1am/image/upload/v1704590628/weeshr_website/c9jufgt5n7dm009cehr4.png"
          alt="Weeshr Logo"
          width={130}
          height={42}
          priority
        />
      </div>

      {/* 📌 MOBILE BACKGROUND IMAGE + CARD */}
      <div className="md:hidden flex-1 px-2 mt-2 pb-2 min-h-0 w-full relative">
        <motion.div
          className="relative w-full h-full rounded-3xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="https://res.cloudinary.com/drykej1am/image/upload/v1767725180/market-place/vendors/Rectangle_3870_1_wfzehc.png"
            alt="Vendor Background"
            fill
            className="object-cover rounded-3xl"
            priority
          />
          {/* CARD OVER THE IMAGE */}
          <div className="absolute bottom-[15%] left-0 right-0 px-2">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-3xl bg-[#E9F4D1] border-none">
              <CardHeader className="px-5 py-4">
                <CardTitle className="text-xl text-primary text-left p-0">
                  <span className="relative text-primary pr-1 font-normal">
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
                <p className="text-sm text-muted-foreground mt-1">
                  Start exploring gifts from{" "}
                  <span className="font-semibold text-primary">
                    {vendor.name}
                  </span>
                </p>
              </CardHeader>
              <CardContent className="p-1 rounded-xl border-none">
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

                {/* Gift Myself Button - SIMPLIFIED VERSION */}
                <div className="flex justify-left my-1 pl-3">
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
            <div className="relative mt-0 flex items-center justify-end pr-3 md:hidden">
              <span
                className="whitespace-nowrap text-xl mt-10"
                style={{
                  fontFamily: "Playwrite CU, sans-serif",
                  color: "white",
                }}
              >
                start here
              </span>
              <Image
                src="https://res.cloudinary.com/drykej1am/image/upload/v1763995414/weeshr-marketplace/Group_317_dxmhcs.png"
                alt="Pointer Arrow"
                width={32}
                height={32}
                className="ml-2"
              />
            </div>
          </div>
          <motion.div
            className="absolute bottom-5 w-full flex flex-col justify-start items-start px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="relative whitespace-nowrap px-2 text-md "
              style={{
                fontFamily: "Playwrite CU, sans-serif",
                color: "#BAEF23",
              }}
            >
              Surprise
            </span>
            <span className="text-[#E9F4D1] mt-[5px] pl-2">
              the ones you love,
            </span>
            <span className="text-[#E9F4D1] pl-2">send them a gift</span>
          </motion.div>
        </motion.div>
      </div>

      {/* 📌 DESKTOP VERSION */}
      <div className="hidden md:flex min-h-screen flex-row">
        {/* Left Image Section */}
        <motion.div
          className="relative flex-1 m-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="https://res.cloudinary.com/drykej1am/image/upload/v1767725180/market-place/vendors/Rectangle_3870_1_wfzehc.png"
            alt="Vendor Background"
            fill
            className="object-cover rounded-3xl"
            priority
          />
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
          className="flex flex-1 flex-col items-center justify-center p-6 md:pb-40 relative"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="https://res.cloudinary.com/drykej1am/image/upload/v1704590628/weeshr_website/c9jufgt5n7dm009cehr4.png"
            alt="Weeshr Logo"
            width={144}
            height={48}
            className="mb-28"
            priority
          />
x
          {vendor.name}

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
              <div className="flex items-center gap-2 mt-2">
                {vendor.image && (
                  <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={vendor.image}
                      alt={vendor.name}
                      width={24}
                      height={24}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Start your journey with{" "}
                  <span className="font-semibold text-primary">
                    {vendor.name}
                  </span>
                </p>
              </div>
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
                fontFamily: "Playwrite CU, sans-serif",
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
