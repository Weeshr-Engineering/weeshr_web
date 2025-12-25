import {
  fetchVendorsByCategory,
  fetchProductsByVendor,
  fetchAllVendors,
} from "@/lib/api";

export interface ApiVendor {
  _id: string;
  logo: null | {
    secure_url: string;
    url: string;
    public_id: string;
    version: number;
  };
  banner?: null | {
    secure_url: string;
    url: string;
    public_id: string;
    version: number;
    width?: number;
    height?: number;
    format?: string;
  };
  cover: null;
  rcNumber: number;
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  companyState: string;
  status: string;
  createdAt: string;
  categories?: string[];
  productCount: number;
  totalProducts?: number; // Keep for backward compatibility if used elsewhere
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
  tag?: Array<{
    _id: string;
    name: string;
    description: string;
    image?: {
      secure_url: string;
    };
  }>;
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

      // Map vendors directly using the information we already have
      return apiVendors
        .filter((vendor: ApiVendor) => vendor.productCount > 0)
        .map((vendor: ApiVendor) => {
          // Use banner if available, then logo, then fallback
          let vendorImage: string;
          if (vendor.banner && vendor.banner.secure_url) {
            vendorImage = vendor.banner.secure_url;
          } else if (vendor.logo && vendor.logo.secure_url) {
            vendorImage = vendor.logo.secure_url;
          } else {
            vendorImage = this.getDefaultVendorImage(vendor.companyName);
          }

          return {
            id: vendor._id,
            name: vendor.companyName,
            image: vendorImage,
            rating: this.calculateVendorRating(vendor),
            category: this.getVendorCategory(vendor),
            badges: this.generateBadges(vendor),
            giftIdeas: vendor.productCount,
            productImages: vendor.banner ? [vendor.banner.secure_url] : [],
          };
        });
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

      // Process vendors directly
      const validVendors = apiVendors
        .filter((vendor: ApiVendor) => vendor.productCount > 0)
        .map((vendor: ApiVendor) => {
          // Use banner if available, then logo, then fallback
          let vendorImage: string;
          if (vendor.banner && vendor.banner.secure_url) {
            vendorImage = vendor.banner.secure_url;
          } else if (vendor.logo && vendor.logo.secure_url) {
            vendorImage = vendor.logo.secure_url;
          } else {
            vendorImage = this.getDefaultVendorImage(vendor.companyName);
          }

          return {
            id: vendor._id,
            name: vendor.companyName,
            image: vendorImage,
            rating: this.calculateVendorRating(vendor),
            category: this.getVendorCategory(vendor),
            badges: this.generateBadges(vendor),
            giftIdeas: vendor.productCount,
            productImages: vendor.banner ? [vendor.banner.secure_url] : [],
          };
        });

      return {
        vendors: validVendors,
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

  private static getDefaultVendorImage(vendorName: string): string {
    const foodPlaceholders = ["🍕", "🍔", "🍣", "🍜", "🌮", "🍝", "🍛", "🥗"];
    const randomEmoji =
      foodPlaceholders[Math.floor(Math.random() * foodPlaceholders.length)];

    return `https://via.placeholder.com/400x240/4F46E5/FFFFFF?text=${encodeURIComponent(
      vendorName
    )}`;
  }

  // New helper method to safely get vendor category
  private static getVendorCategory(vendor: ApiVendor): string {
    return vendor.categories && vendor.categories.length > 0
      ? vendor.categories[0]
      : "General";
  }

  private static calculateVendorRating(vendor: ApiVendor): number {
    let rating = 4.0;
    const products = vendor.productCount || vendor.totalProducts || 0;
    if (products > 10) rating += 0.5;
    if (products > 5) rating += 0.3;
    if (vendor.status === "published") rating += 0.2;
    return Math.min(Math.max(rating, 4.0), 5.0);
  }

  private static generateBadges(vendor: ApiVendor): string[] {
    const badges: string[] = [];
    const products = vendor.productCount || vendor.totalProducts || 0;

    if (products > 5) {
      badges.push("Popular");
    }

    if (vendor.companyState === "Lagos") {
      badges.push("Lagos");
    }

    if (vendor.status === "published") {
      badges.push("Verified");
    }

    if (products > 10) {
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
