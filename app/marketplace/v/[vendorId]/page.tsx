import { VendorService } from "@/service/vendor.service";
import LandingClient from "./landing-client";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vendorId: string }>;
}): Promise<Metadata> {
  const { vendorId } = await params;
  const vendor = await VendorService.getVendorById(vendorId);
  return {
    title: vendor ? `Gift from ${vendor.name} | Weeshr` : "Vendor Not Found",
    description: vendor
      ? `Browse gifts from ${vendor.name} on Weeshr`
      : "Vendor page not found",
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
