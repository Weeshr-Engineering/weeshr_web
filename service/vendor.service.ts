import {
  fetchVendorsByCategory,
  fetchProductsByVendor,
  fetchAllVendors,
  fetchVendorById,
  fetchVendorBySlug,
} from "@/lib/api";

export interface CloudinaryImage {
  secure_url: string;
  url: string;
  public_id: string;
  version: number;
  width?: number;
  height?: number;
  format?: string;
}

export interface ApiVendor {
  _id: string;
  logo: null | CloudinaryImage;
  banner?: null | CloudinaryImage | CloudinaryImage[];
  cover: null;
  rcNumber: number;
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  companyState: string;
  status: string;
  createdAt: string;
  weeshrName?: string;
  categories?: (
    | string
    | {
        _id: string;
        name: string;
      }
  )[];
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
  badge?: string;
  categoryId?: string;
  slug?: string;
  badges: string[];
  giftIdeas: number;
  productImages: string[];
  description?: string;
}

export class VendorService {
  static async getVendorsByCategory(categoryId: string): Promise<Vendor[]> {
    try {
      console.log(`Fetching vendors for category: ${categoryId}`);
      const apiVendors: ApiVendor[] = await fetchVendorsByCategory(categoryId);
      console.log(
        `Found ${apiVendors.length} vendors for category ${categoryId}`,
      );

      // Map vendors directly using the information we already have
      return apiVendors
        .filter((vendor: ApiVendor) => vendor.productCount > 0)
        .map((vendor: ApiVendor) => {
          // Use banner if available, then logo, then fallback
          let vendorImage: string;
          let productImages: string[] = [];

          if (vendor.banner) {
            if (Array.isArray(vendor.banner)) {
              vendorImage = vendor.banner[0]?.secure_url || "";
              productImages = vendor.banner.map((b) => b.secure_url);
            } else {
              vendorImage = vendor.banner.secure_url;
              productImages = [vendor.banner.secure_url];
            }
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
            productImages: productImages,
          };
        });
    } catch (error) {
      console.error("Error fetching vendors:", error);
      return [];
    }
  }

  static async getVendorBySlug(slug: string): Promise<Vendor | null> {
    try {
      const apiVendor: ApiVendor = await fetchVendorBySlug(slug);
      if (!apiVendor) return null;

      // Map single vendor
      let vendorImage: string;
      let productImages: string[] = [];

      if (apiVendor.banner) {
        if (Array.isArray(apiVendor.banner)) {
          vendorImage = apiVendor.banner[0]?.secure_url || "";
          productImages = apiVendor.banner.map((b) => b.secure_url);
        } else {
          vendorImage = apiVendor.banner.secure_url;
          productImages = [apiVendor.banner.secure_url];
        }
      } else if (apiVendor.logo && apiVendor.logo.secure_url) {
        vendorImage = apiVendor.logo.secure_url;
      } else {
        vendorImage = this.getDefaultVendorImage(apiVendor.companyName);
      }

      return {
        id: apiVendor._id,
        name: apiVendor.companyName,
        image: vendorImage,
        rating: this.calculateVendorRating(apiVendor),
        category: this.getVendorCategory(apiVendor),
        categoryId: this.getVendorCategoryId(apiVendor),
        slug: apiVendor.weeshrName,
        badges: this.generateBadges(apiVendor),
        giftIdeas: apiVendor.productCount || apiVendor.totalProducts || 0,
        productImages: productImages,
      };
    } catch (error) {
      console.error(`Error fetching vendor by slug ${slug}:`, error);
      return null;
    }
  }

  static async getVendorById(vendorId: string): Promise<Vendor | null> {
    try {
      const apiVendor: ApiVendor = await fetchVendorById(vendorId);
      if (!apiVendor) return null;

      // Map single vendor
      let vendorImage: string;
      let productImages: string[] = [];

      if (apiVendor.banner) {
        if (Array.isArray(apiVendor.banner)) {
          vendorImage = apiVendor.banner[0]?.secure_url || "";
          productImages = apiVendor.banner.map((b) => b.secure_url);
        } else {
          vendorImage = apiVendor.banner.secure_url;
          productImages = [apiVendor.banner.secure_url];
        }
      } else if (apiVendor.logo && apiVendor.logo.secure_url) {
        vendorImage = apiVendor.logo.secure_url;
      } else {
        vendorImage = this.getDefaultVendorImage(apiVendor.companyName);
      }

      return {
        id: apiVendor._id,
        name: apiVendor.companyName,
        image: vendorImage,
        rating: this.calculateVendorRating(apiVendor),
        category: this.getVendorCategory(apiVendor),
        categoryId: this.getVendorCategoryId(apiVendor),
        slug: apiVendor.weeshrName,
        badges: this.generateBadges(apiVendor),
        giftIdeas: apiVendor.productCount || apiVendor.totalProducts || 0,
        productImages: productImages,
      };
    } catch (error) {
      console.error(`Error fetching vendor ${vendorId}:`, error);
      return null;
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
          let productImages: string[] = [];

          if (vendor.banner) {
            if (Array.isArray(vendor.banner)) {
              vendorImage = vendor.banner[0]?.secure_url || "";
              productImages = vendor.banner.map((b) => b.secure_url);
            } else {
              vendorImage = vendor.banner.secure_url;
              productImages = [vendor.banner.secure_url];
            }
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
            productImages: productImages,
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
    // Return a simple gray SVG data URI instead of fetching from an API
    return `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjNGNEY2Ii8+PC9zdmc+`;
  }

  // New helper method to safely get vendor category
  private static getVendorCategory(vendor: ApiVendor): string {
    if (!vendor.categories || vendor.categories.length === 0) return "General";
    const category = vendor.categories[0];
    if (typeof category === "string") return category;
    return category.name || "General";
  }

  private static getVendorCategoryId(vendor: ApiVendor): string | undefined {
    if (!vendor.categories || vendor.categories.length === 0) return undefined;
    const category = vendor.categories[0];
    if (typeof category === "object" && "_id" in category) return category._id;
    return undefined;
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
      const response = await fetchProductsByVendor(vendorId);
      return response.products
        .filter((product: ApiProduct) => product?.image?.secure_url)
        .map((product: ApiProduct) => product.image!.secure_url);
    } catch (error) {
      console.error(
        `Error fetching product images for vendor ${vendorId}:`,
        error,
      );
      return [];
    }
  }
}
