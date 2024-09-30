import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";

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
        url: "https://res.cloudinary.com/drykej1am/image/upload/v1704585596/weeshr_website/scybremtt3coh9qnsj3v.png",
        width: 800,
        height: 600,
      },
      {
        url: "https://res.cloudinary.com/drykej1am/image/upload/v1704585596/weeshr_website/scybremtt3coh9qnsj3v.png",
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
      "https://res.cloudinary.com/drykej1am/image/upload/v1704585596/weeshr_website/scybremtt3coh9qnsj3v.png",
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
      <body className={outfit.className}>{children}</body>
    </html>
  );
}
