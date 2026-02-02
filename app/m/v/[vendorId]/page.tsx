import { VendorService } from "@/service/vendor.service";
import LandingClient from "./landing-client";
import { Metadata } from "next";

// Rotating taglines for variety
const taglines = [
  "Surprise someone special… yes, that someone can be you 😉",
  "Surprise the ones you love — or treat yourself — with a gift.",
  "Send a gift to someone you love — or to yourself.",
  "Because self-love counts too. Send a gift to yourself or someone special.",
];

// Get a consistent but rotating tagline based on vendor ID
function getTaglineForVendor(vendorId: string): string {
  const hash = vendorId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return taglines[hash % taglines.length];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vendorId: string }>;
}): Promise<Metadata> {
  const { vendorId } = await params;
  const vendor = await VendorService.getVendorById(vendorId);

  if (!vendor) {
    return {
      title: "Vendor Not Found | Weeshr",
      description:
        "The vendor you're looking for doesn't exist or has been removed.",
    };
  }

  const tagline = getTaglineForVendor(vendorId);
  const title = `${vendor.name} | Weeshr`;
  const description = `${vendor.name} — ${tagline}`;
  const vendorUrl = `https://weeshr.com/v/${vendor.slug || vendorId}`;

  // Use vendor's image or banner, fallback to Weeshr default
  const imageUrl =
    vendor.image ||
    "https://res.cloudinary.com/drykej1am/image/upload/v1727903584/weeshr_website/ThumbnailWeeshr_1_3_oicmbz.png";

  return {
    title,
    description,
    keywords: [
      vendor.name,
      "gifts",
      "weeshr",
      "gift ideas",
      vendor.category,
      "surprise gifts",
      "send gifts",
      "online gifting",
    ],
    openGraph: {
      title,
      description,
      url: vendorUrl,
      siteName: "Weeshr",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${vendor.name} on Weeshr`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: vendorUrl,
    },
  };
}

export default async function VendorLandingPage({
  params,
}: {
  params: Promise<{ vendorId: string }>;
}) {
  const { vendorId } = await params;
  const vendor = await VendorService.getVendorById(vendorId);

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <h1 className="text-2xl font-bold text-white mb-2">Vendor Not Found</h1>
        <p className="text-white/80">
          The vendor you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  return <LandingClient vendor={vendor} />;
}
