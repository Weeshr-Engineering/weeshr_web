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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: PageProps) {
  console.time("ProductDetailPage fetch");
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const { productId, product: vendorSlug } = resolvedParams;
  const vendorIdFromQuery = resolvedSearchParams.vendorId as string | undefined;

  console.log(
    `Fetching product detail for ID: ${productId}, Vendor: ${vendorSlug || vendorIdFromQuery}`,
  );

  let vendorIdToUse: string | undefined = vendorIdFromQuery;

  // Fetch the vendor by slug only if vendorId is not already provided in query
  if (!vendorIdToUse && vendorSlug) {
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
    console.timeEnd("ProductDetailPage fetch");
    return <ProductNotFound />;
  }

  // Fetch related products
  let relatedProducts = [];
  if (product.vendorId) {
    const response = await ProductService.getProductsByVendor(
      product.vendorId,
      1,
      10,
    );
    relatedProducts = response.products.filter((p) => p.id !== productId);
  }

  console.timeEnd("ProductDetailPage fetch");

  return (
    <ProductDetailClient
      initialProduct={product}
      initialRelatedProducts={relatedProducts}
    />
  );
}
