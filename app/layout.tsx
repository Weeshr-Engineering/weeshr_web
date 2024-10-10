import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { GoogleTagManager } from "@next/third-parties/google";
import { GoogleAnalytics } from "@next/third-parties/google";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weeshr",
  description: "Make a Weesh!! ",
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="G-2W2JYJPBXZ" />
      <GoogleAnalytics gaId="G-2W2JYJPBXZ" />

      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Add other fonts if necessary, using next/font/google */}
        {/* Example for the Dancing Script font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playwrite+CU:wght@100..400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={outfit.className}>
        {children}
        <Toaster position="bottom-right" reverseOrder={false} />
      </body>
    </html>
  );
}
