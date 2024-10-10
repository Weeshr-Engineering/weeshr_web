import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

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
      <Head>
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

        {/* Google Tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-2W2JYJPBXZ"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-2W2JYJPBXZ');
            `,
          }}
        />
      </Head>
      <body className={outfit.className}>
        {children}
        <Toaster position="bottom-right" reverseOrder={false} />
      </body>
    </html>
  );
}
