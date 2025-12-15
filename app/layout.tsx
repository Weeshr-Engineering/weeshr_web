import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import ClientLayout from "./ClientLayout";

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
        width: 1200,
        height: 630,
        alt: "Weeshr",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weeshr",
    description: "Make a Weesh",
    images: [
      "https://res.cloudinary.com/drykej1am/image/upload/v1727903584/weeshr_website/ThumbnailWeeshr_1_3_oicmbz.png",
    ],
  },
  other: {
    "google-site-verification": "Tpygm8ffQSGqRVivwFb15HdAmCgdfeGYNQ49vxTZKt4",
    "fb:app_id": "1323012452458565",
    "twilio-domain-verification": "42870666a6fda3c6f1aae9bbbd428b1f",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <GoogleTagManager gtmId="G-2W2JYJPBXZ" />
      <GoogleAnalytics gaId="G-2W2JYJPBXZ" />

      <body className={`${outfit.className} h-full full-viewport`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
