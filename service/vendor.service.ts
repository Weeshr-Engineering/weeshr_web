import {
  fetchVendorsByCategory,
  fetchProductsByVendor,
  fetchAllVendors,
} from "@/lib/api";

export interface ApiVendor {
  _id: string;
  logo: null;
  cover: null;
  rcNumber: number;
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  companyState: string;
  status: string;
  createdAt: string;
  categories?: string[]; // Make optional
  totalProducts: number;
}

export interface ProductImage {
  secure_url: string;
  url: string;
}

export interface ApiProduct {
  _id: string;
  image?: ProductImage; // Make optional
  name: string;
  vendorId: string;
}

export interface Vendor {
  id: string;
  name: string;
  image: string;
  rating: number;
  category: string;
  badges: string[];
  giftIdeas: number;
  productImages: string[];
}

export class VendorService {
  static async getVendorsByCategory(categoryId: string): Promise<Vendor[]> {
    try {
      console.log(`Fetching vendors for category: ${categoryId}`);
      const apiVendors: ApiVendor[] = await fetchVendorsByCategory(categoryId);
      console.log(
        `Found ${apiVendors.length} vendors for category ${categoryId}`
      );

      // Filter out vendors with no products and get valid ones
      const validVendors = await Promise.all(
        apiVendors.map(async (vendor) => {
          try {
            const enrichedVendor = await this.enrichVendorWithProductImages(
              vendor
            );
            // Only return vendors that have at least one product image or are valid
            return enrichedVendor;
          } catch (error) {
            console.error(`Error enriching vendor ${vendor._id}:`, error);
            return null;
          }
        })
      );

      // Filter out null values and vendors without product images
      return validVendors.filter(
        (vendor): vendor is Vendor =>
          vendor !== null && vendor.productImages.length > 0
      );
    } catch (error) {
      console.error("Error fetching vendors:", error);
      return [];
    }
  }

  static async getAllVendors(page: number = 1): Promise<{
    vendors: Vendor[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      perPage: number;
    };
  }> {
    try {
      console.log(`Fetching all vendors - page: ${page}`);
      const { vendors: apiVendors, pagination } = await fetchAllVendors(page);
      console.log(`Found ${apiVendors.length} vendors on page ${page}`);

      // Process vendors in parallel but handle errors individually
      const validVendors = await Promise.all(
        apiVendors.map(async (vendor: ApiVendor) => {
          try {
            const enrichedVendor = await this.enrichVendorWithProductImages(
              vendor
            );
            // Only return vendors that have at least one product image
            return enrichedVendor.productImages.length > 0
              ? enrichedVendor
              : null;
          } catch (error) {
            console.error(`Error processing vendor ${vendor._id}:`, error);
            return null;
          }
        })
      );

      // Filter out null values
      const vendorsWithImages = validVendors.filter(
        (vendor): vendor is Vendor => vendor !== null
      );

      console.log(`Returning ${vendorsWithImages.length} valid vendors`);

      return {
        vendors: vendorsWithImages,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching all vendors:", error);
      return {
        vendors: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          perPage: 2,
        },
      };
    }
  }

  private static async enrichVendorWithProductImages(
    vendor: ApiVendor
  ): Promise<Vendor> {
    try {
      // Fetch products for this vendor to get images
      const products = await fetchProductsByVendor(vendor._id);

      // Safely get product images with null checking
      const productImages = products
        .filter((product: ApiProduct) => product?.image?.secure_url)
        .map((product: ApiProduct) => product.image!.secure_url)
        .slice(0, 5);

      // If no product images found, use fallback but still return vendor
      const vendorImage =
        productImages.length > 0
          ? productImages[0]
          : this.getDefaultVendorImage(vendor.companyName);

      return {
        id: vendor._id,
        name: vendor.companyName,
        image: vendorImage,
        rating: this.calculateVendorRating(vendor),
        category: this.getVendorCategory(vendor), // Use safe method
        badges: this.generateBadges(vendor),
        giftIdeas: vendor.totalProducts || 0,
        productImages: productImages,
      };
    } catch (error) {
      console.error(`Error fetching products for vendor ${vendor._id}:`, error);
      // Return vendor with fallback image
      return this.createVendorWithFallback(vendor);
    }
  }

  private static selectBestVendorImage(
    productImages: string[],
    vendorName: string
  ): string {
    if (productImages.length === 0) {
      return this.getDefaultVendorImage(vendorName);
    }
    return productImages[0];
  }

  private static getDefaultVendorImage(vendorName: string): string {
    const foodPlaceholders = ["🍕", "🍔", "🍣", "🍜", "🌮", "🍝", "🍛", "🥗"];
    const randomEmoji =
      foodPlaceholders[Math.floor(Math.random() * foodPlaceholders.length)];
    return `/api/placeholder/400/240?text=${encodeURIComponent(
      vendorName
    )}&emoji=${randomEmoji}`;
  }

  private static createVendorWithFallback(vendor: ApiVendor): Vendor {
    return {
      id: vendor._id,
      name: vendor.companyName,
      image: this.getDefaultVendorImage(vendor.companyName),
      rating: this.calculateVendorRating(vendor),
      category: this.getVendorCategory(vendor), // Use safe method
      badges: this.generateBadges(vendor),
      giftIdeas: vendor.totalProducts || 0,
      productImages: [],
    };
  }

  // New helper method to safely get vendor category
  private static getVendorCategory(vendor: ApiVendor): string {
    return vendor.categories && vendor.categories.length > 0
      ? vendor.categories[0]
      : "General";
  }

  private static calculateVendorRating(vendor: ApiVendor): number {
    let rating = 4.0;
    if (vendor.totalProducts > 10) rating += 0.5;
    if (vendor.totalProducts > 5) rating += 0.3;
    if (vendor.status === "published") rating += 0.2;
    return Math.min(Math.max(rating, 4.0), 5.0);
  }

  private static generateBadges(vendor: ApiVendor): string[] {
    const badges: string[] = [];

    if (vendor.totalProducts > 5) {
      badges.push("Popular");
    }

    if (vendor.companyState === "Lagos") {
      badges.push("Lagos");
    }

    if (vendor.status === "published") {
      badges.push("Verified");
    }

    if (vendor.totalProducts > 10) {
      badges.push("Many Options");
    }

    if (badges.length === 0) {
      badges.push("New");
    }

    return badges.slice(0, 3);
  }

  static async getVendorProductImages(vendorId: string): Promise<string[]> {
    try {
      const products = await fetchProductsByVendor(vendorId);
      return products
        .filter((product: ApiProduct) => product?.image?.secure_url)
        .map((product: ApiProduct) => product.image!.secure_url);
    } catch (error) {
      console.error(
        `Error fetching product images for vendor ${vendorId}:`,
        error
      );
      return [];
    }
  }
}
