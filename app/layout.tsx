"use client";

import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { GoogleTagManager } from "@next/third-parties/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import RuutChat from "@/components/commons/RuutChat";
import { usePathname } from "next/navigation";

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isMarketplacePath = pathname?.startsWith("/marketplace");

  return (
    <html lang="en" className="h-full">
      <GoogleTagManager gtmId="G-2W2JYJPBXZ" />
      <GoogleAnalytics gaId="G-2W2JYJPBXZ" />

      <head>
        {/* Updated viewport for full-screen mobile experience */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />

        {/* iOS specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Weeshr" />

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
      </head>
      <body className={`${outfit.className} h-full full-viewport`}>
        {children}
        <Toaster position="bottom-right" reverseOrder={false} />

        {/* Ruut Chat Integration - Hidden on marketplace paths */}
        {!isMarketplacePath && <RuutChat />}
      </body>
    </html>
  );
}
