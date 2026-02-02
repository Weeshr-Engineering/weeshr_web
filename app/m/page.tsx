import { Metadata } from "next";
import MarketplaceClient from "./marketplace-client";

export const metadata: Metadata = {
  title: "Weeshr | Send Gifts to Someone Special",
  description:
    "Surprise the ones you love — or treat yourself — with a gift. Browse amazing gift ideas from top vendors on Weeshr.",
  keywords: [
    "weeshr",
    "gifts",
    "send gifts",
    "gift ideas",
    "surprise gifts",
    "online gifting",
    "gift marketplace",
    "treat yourself",
  ],
  openGraph: {
    title: "Weeshr | Send Gifts to Someone Special",
    description:
      "Surprise the ones you love — or treat yourself — with a gift.",
    url: "https://weeshr.com/m",
    siteName: "Weeshr",
    images: [
      {
        url: "https://res.cloudinary.com/drykej1am/image/upload/v1727903584/weeshr_website/ThumbnailWeeshr_1_3_oicmbz.png",
        width: 1200,
        height: 630,
        alt: "Weeshr - Send Gifts to Someone Special",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weeshr | Send Gifts to Someone Special",
    description:
      "Surprise the ones you love — or treat yourself — with a gift.",
    images: [
      "https://res.cloudinary.com/drykej1am/image/upload/v1727903584/weeshr_website/ThumbnailWeeshr_1_3_oicmbz.png",
    ],
  },
  alternates: {
    canonical: "https://weeshr.com/m",
  },
};

export default function Home() {
  return <MarketplaceClient />;
}
