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
  isAvailable: boolean;
}

/**
 * Service for product-related operations
 */
export class ProductService {
  /**
   * Fetch products by vendor ID
   */
  static async getProductsByVendor(vendorId: string): Promise<Product[]> {
    try {
      const apiProducts: ApiProduct[] = await fetchProductsByVendor(vendorId);

      return apiProducts.map((product) => ({
        id: product._id,
        name: product.name,
        description: product.description,
        image:
          product.image?.secure_url ||
          this.getDefaultProductImage(product.name),
        price: product.amount / 100, // Convert from kobo to naira
        vendorId: product.vendorId,
        category: product.tag[0]?.name || "Food",
        isAvailable:
          product.status === "published" &&
          !product.isDeleted &&
          product.qty > 0,
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
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
      productName
    )}&emoji=${randomEmoji}`;
  }
}
