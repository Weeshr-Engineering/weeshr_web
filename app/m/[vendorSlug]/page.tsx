import { VendorService } from "@/service/vendor.service";
import LandingClient from "../v/[vendorId]/landing-client";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vendorSlug: string }>;
}): Promise<Metadata> {
  const { vendorSlug } = await params;

  try {
    const vendor = await VendorService.getVendorBySlug(vendorSlug);

    if (!vendor) {
      return {
        title: "Vendor Not Found | Weeshr",
        description:
          "The vendor you're looking for doesn't exist or has been removed.",
      };
    }

    const title = `Find gifts from ${vendor.name} on Weeshr`;
    const description = "Weeshr |Send gifts to Someone Special";
    const vendorUrl = `https://weeshr.com/m/${vendorSlug}`;

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
        "self-gifting",
        "treat yourself",
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
  } catch (error) {
    return {
      title: "Vendor Not Found | Weeshr",
      description:
        "The vendor you're looking for doesn't exist or has been removed.",
    };
  }
}

export default async function VendorSlugPage({
  params,
}: {
  params: Promise<{ vendorSlug: string }>;
}) {
  const { vendorSlug } = await params;
  const vendor = await VendorService.getVendorBySlug(vendorSlug);

  if (!vendor) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-white/40 backdrop-blur-2xl">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-[32px] shadow-xl border-none overflow-hidden flex flex-col items-center justify-center py-10 relative">
          <CardContent className="p-8 text-center w-full">
            {/* Error Image */}
            <div className="flex justify-center mb-6">
              <div className="relative h-48 w-48">
                <Image
                  fill
                  className="object-contain"
                  src="/failed.svg"
                  alt="Vendor Not Found"
                  priority
                />
              </div>
            </div>

            {/* Error Message */}
            <CardHeader className="text-center space-y-3 px-0 pb-6">
              <h1 className="text-2xl font-bold text-[#020721]">
                Vendor Not Found
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                The vendor <span className="font-semibold">{vendorSlug}</span>{" "}
                could not be found.
                <br />
                <span className="text-gray-500">
                  Please check the URL or return to the marketplace.
                </span>
              </p>
            </CardHeader>

            {/* Actions */}
            <div className="space-y-3 w-full">
              <Link href="/ma" className="w-full block">
                <Button className="w-full rounded-xl bg-[#3E68FF] text-white hover:bg-[#2d5aff] transition h-12 font-medium">
                  Go to Marketplace
                </Button>
              </Link>
            </div>

            {/* Support Info */}
            <div className="mt-6 p-4 bg-[#F6F7FF] rounded-xl">
              <p className="text-xs text-gray-600">
                Need help? Contact our support team at{" "}
                <a
                  href="mailto:support@weeshr.com"
                  className="text-[#3E68FF] hover:underline font-medium"
                >
                  support@weeshr.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <LandingClient vendor={vendor} />;
}
