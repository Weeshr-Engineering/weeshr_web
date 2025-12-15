"use client";

import { useEffect } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";

import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";

import RuutChat from "@/components/commons/RuutChat";
import { usePathname } from "next/navigation";

const outfit = Outfit({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Weeshr",
  description: "Make a Weesh!!",
  openGraph: {
    title: "Weeshr",
    description: "Make a Weesh!!",
    url: "https://weeshr.com",
    images: [
      {
        url: "https://res.cloudinary.com/drykej1am/image/upload/v1727903584/weeshr_website/ThumbnailWeeshr_1_3_oicmbz.png",
        width: 800,
        height: 600,
      },
      {
        url: "https://res.cloudinary.com/drykej1am/image/upload/v1727903584/weeshr_website/ThumbnailWeeshr_1_3_oicmbz.png",
        width: 1800,
        height: 1600,
        alt: "Weeshr alt",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: "Weeshr",
    description: "Make a Weesh",
    images: [
      "https://res.cloudinary.com/drykej1am/image/upload/v1727903584/weeshr_website/ThumbnailWeeshr_1_3_oicmbz.png",
    ],
  },
  other: {
    "google-site-verification": "Tpygm8ffQSGqRVivwFb15HdAmCgdfeGYNQ49vxTZKt4",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMarketplacePath = pathname?.startsWith("/marketplace");

  // 🔥 Dynamically load Google Maps JS (safe way)
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error("Google Maps API Key missing!");
      return;
    }

    // Prevent double script injection
    if (document.getElementById("google-maps-script")) return;

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  return (
    <html lang="en" className="h-full">
      <GoogleTagManager gtmId="G-2W2JYJPBXZ" />
      <GoogleAnalytics gaId="G-2W2JYJPBXZ" />

      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Weeshr" />
        <meta
          name="twilio-domain-verification"
          content="42870666a6fda3c6f1aae9bbbd428b1f"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playwrite+CU:wght@100..400&display=swap"
          rel="stylesheet"
        />
        <meta property="fb:app_id" content="1323012452458565" />

        {/* Optional: If you want to manually inject Facebook App ID */}
        {/* <meta property="fb:app_id" content="1323012452458565" /> */}
      </head>

      <body className={`${outfit.className} h-full full-viewport`}>
        {children}
        <Toaster position="bottom-right" reverseOrder={false} />

        {!isMarketplacePath && <RuutChat />}
      </body>
    </html>
  );
}
