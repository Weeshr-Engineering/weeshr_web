import { fetchProductsByVendor } from "@/lib/api";

export interface ApiProduct {
  _id: string;
  name: string;
  description: string;
  image: {
    secure_url: string;
    url: string;
  } | null;
  images?: Array<{
    secure_url: string;
    url: string;
  }>;
  amount: number;
  tat: string;
  qty: number;
  vendorId: string;
  tag: Array<{
    _id: string;
    name: string;
    description: string;
    image?: {
      secure_url: string;
    };
  }>;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  images: string[];
  price: number;
  vendorId: string;
  category: string;
  categoryId: string;
  isAvailable: boolean;
}

/**
 * Service for product-related operations
 */
export class ProductService {
  /**
   * Fetch products by vendor ID with pagination
   */
  static async getProductsByVendor(
    vendorId: string,
    page: number = 1,
    perPage: number = 100,
  ): Promise<{
    products: Product[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      perPage: number;
    };
  }> {
    try {
      const response = await fetchProductsByVendor(vendorId, page, perPage);
      const apiProducts: ApiProduct[] = response.products;

      // Debug API response
      console.log(
        "API Products raw:",
        apiProducts.map((p) => ({
          name: p.name,
          hasImage: !!p.image,
          imagesCount: p.images?.length,
        })),
      );

      const products = apiProducts.map((product) => {
        const mainImage =
          product.image?.secure_url ||
          product.images?.[0]?.secure_url ||
          this.getDefaultProductImage(product.name);

        const images =
          product.images && product.images.length > 0
            ? product.images.map((img) => img.secure_url)
            : [mainImage];

        return {
          id: product._id,
          name: product.name,
          description: product.description,
          image: mainImage,
          images: images,
          price: product.amount, // Convert from kobo to naira
          vendorId: product.vendorId,
          category: product.tag[0]?.name || "Food",
          categoryId: product.tag[0]?._id || "",
          isAvailable:
            product.status === "published" &&
            !product.isDeleted &&
            product.qty > 0,
        };
      });

      // Debug mapped products
      console.log(
        "Mapped Products:",
        products.map((p) => ({
          name: p.name,
          imagesCount: p.images.length,
          firstImage: p.image,
        })),
      );

      return {
        products,
        pagination: response.pagination,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        products: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          perPage: perPage,
        },
      };
    }
  }

  /**
   * Get default product image
   */
  private static getDefaultProductImage(productName: string): string {
    // Return a simple gray SVG data URI instead of fetching from an API
    return `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjNGNEY2Ii8+PC9zdmc+`;
  }
}
