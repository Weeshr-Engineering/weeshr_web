import { ProductService } from "@/service/product.service";
import { VendorService } from "@/service/vendor.service";
import ProductDetailClient from "./_components/product-detail-client";
import ProductNotFound from "./_components/product-not-found";

interface PageProps {
  params: Promise<{
    vendor: string;
    product: string;
    productId: string;
  }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { productId, product: vendorSlug } = resolvedParams;

  let vendorIdToUse: string | undefined;

  // Fetch the vendor first to get the vendorId (allowed on server)
  if (vendorSlug) {
    try {
      const vendor = await VendorService.getVendorBySlug(vendorSlug);
      if (vendor) {
        vendorIdToUse = vendor.id;
      }
    } catch (error) {
      console.error("Failed to fetch vendor for ID resolution:", error);
    }
  }

  // Fetch the product with the vendorId body (allowed on server with GET)
  const product = await ProductService.getProductById(productId, vendorIdToUse);

  if (!product) {
    return <ProductNotFound />;
  }

  // Fetch related products
  let relatedProducts = [];
  if (product.vendorId) {
    const response = await ProductService.getProductsByVendor(
      product.vendorId,
      1,
      10
    );
    relatedProducts = response.products.filter((p) => p.id !== productId);
  }

  return (
    <ProductDetailClient
      initialProduct={product}
      initialRelatedProducts={relatedProducts}
    />
  );
}
