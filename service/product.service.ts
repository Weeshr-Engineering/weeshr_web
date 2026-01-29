import { fetchProductsByVendor } from "@/lib/api";

export interface ApiProduct {
  _id: string;
  name: string;
  description: string;
  image: {
    secure_url: string;
    url: string;
  };
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

      const products = apiProducts.map((product) => ({
        id: product._id,
        name: product.name,
        description: product.description,
        image:
          product.image?.secure_url ||
          this.getDefaultProductImage(product.name),
        price: product.amount, // Convert from kobo to naira
        vendorId: product.vendorId,
        category: product.tag[0]?.name || "Food",
        categoryId: product.tag[0]?._id || "",
        isAvailable:
          product.status === "published" &&
          !product.isDeleted &&
          product.qty > 0,
      }));

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
    const foodPlaceholders = ["🍕", "🍔", "🍣", "🍜", "🌮", "🍝", "🍛", "🥗"];
    const randomEmoji =
      foodPlaceholders[Math.floor(Math.random() * foodPlaceholders.length)];
    return `/api/placeholder/200/200?text=${encodeURIComponent(
      productName,
    )}&emoji=${randomEmoji}`;
  }
}
