"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function Home() {
  const [receiverName, setReceiverName] = useState("");
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverName.trim()) return;

    if (receiverName.trim().length < 2) {
      toast.error("Name must be at least 2 characters long");
      return;
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(receiverName.trim())) {
      toast.error("Name can only contain letters and numbers");
      return;
    }

    router.push(
      `marketplace/categories?name=${encodeURIComponent(receiverName.trim())}`
    );
  };
  return (
    <div
      className="flex flex-col justify-between overflow-hidden min-h-screen h-screen max-h-screen 
                
                pt-[env(safe-area-inset-top)] 
                pb-[env(safe-area-inset-bottom)]"
    >
      {/* 📌 MOBILE TOP LOGO */}
      <div className="w-full flex justify-center pt-12 md:hidden">
        <Image
          src="https://res.cloudinary.com/drykej1am/image/upload/v1704590628/weeshr_website/c9jufgt5n7dm009cehr4.png"
          alt="Weeshr Logo"
          width={144}
          height={48}
          priority
        />
      </div>
      {/* 📌 MOBILE BACKGROUND IMAGE + CARD */}
      <div className="md:hidden p-2 mt-6">
        <div className="relative w-full h-[85vh] rounded-3xl overflow-hidden">
          <Image
            src="https://res.cloudinary.com/drykej1am/image/upload/v1763995415/weeshr-marketplace/Group_1000006517_qfxe3t.png"
            alt="Background"
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
                      style={{ fontFamily: "Playwrite CU, sans-serif" }}
                    >
                      gift?
                    </span>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-1 rounded-xl border-none">
                <PlaceholdersAndVanishInput
                  placeholders={[
                    "Enter receiver's name",
                    "Gift someone special 🎁",
                    "Type a friend's name...",
                    "Who’s the lucky person ? ✨",
                    "Surprise someone today 🎉",
                    "Add a name to start gifting",
                    "Search for a loved one ❤️",
                    "Who deserves a treat ? 🍫",
                    "Enter a colleague’s name 👔",
                    "Make someone smile 😊",
                  ]}
                  onChange={(e) => setReceiverName(e.target.value)}
                  onSubmit={handleSubmit}
                />
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
          <div className="absolute bottom-5 w-full flex flex-col justify-start items-start px-2">
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
          </div>
        </div>
      </div>
      {/* 📌 DESKTOP VERSION — UNCHANGED */}
      <div className="hidden md:flex min-h-screen flex-row">
        {/* Left Image Section */}
        <div className="relative flex-1 m-6">
          <Image
            src="https://res.cloudinary.com/drykej1am/image/upload/v1757702462/weeshr-marketplace/Rectangle_3870_q7bea5.png"
            alt="Background"
            fill
            className="object-cover rounded-3xl"
            priority
          />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <p className="text-3xl font-semibold">
              <span
                className="relative whitespace-nowrap px-2 bg-gradient-custom bg-clip-text text-transparent text-xl sm:text-3xl pb-8"
                style={{ fontFamily: "Playwrite CU, sans-serif" }}
              >
                Surprise
              </span>
            </p>
            <p className="text-2xl">the ones you love,</p>
            <p className="text-2xl">send them a gift</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center p-6 md:pb-40 relative">
          <Image
            src="https://res.cloudinary.com/drykej1am/image/upload/v1704590628/weeshr_website/c9jufgt5n7dm009cehr4.png"
            alt="Weeshr Logo"
            width={144}
            height={48}
            className="mb-28"
            priority
          />
          <Card className="w-full max-w-sm bg-white/80 backdrop-blur-sm shadow-lg px-0 rounded-3xl bg-[#E9F4D1] border-none">
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-xl text-primary text-left p-0">
                <span className="relative text-primary pr-1 font-normal">
                  Who would you like to
                  <span
                    className="relative whitespace-nowrap px-2 bg-gradient-custom bg-clip-text text-transparent text-xl"
                    style={{ fontFamily: "Playwrite CU, sans-serif" }}
                  >
                    gift?
                  </span>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-1">
              <PlaceholdersAndVanishInput
                placeholders={[
                  "Enter receiver's name",
                  "Gift someone special 🎁",
                  "Type a friend's name...",
                  "Who’s the lucky person ? ✨",
                  "Surprise someone today 🎉",
                  "Add a name to start gifting",
                  "Search for a loved one ❤️",
                  "Who deserves a treat ? 🍫",
                  "Enter a colleague’s name 👔",
                  "Make someone smile 😊",
                ]}
                onChange={(e) => setReceiverName(e.target.value)}
                onSubmit={handleSubmit}
              />
            </CardContent>
          </Card>

          <div className="relative mt-4 flex items-center justify-end pr-3 hidden md:flex pl-[220px]">
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
        </div>
      </div>
    </div>
  );
}
