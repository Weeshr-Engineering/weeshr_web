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
    // ... other logo properties
  };
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

      // Process vendors in parallel
      const validVendors = await Promise.all(
        apiVendors.map(async (vendor: ApiVendor) => {
          try {
            let products: ApiProduct[] = [];
            let category = "General";
            let giftIdeas = 0;

            try {
              // Fetch products for this vendor
              products = await fetchProductsByVendor(vendor._id);

              // Get gift ideas count from products
              giftIdeas = products.length;

              // Get category from first product's tag if available
              if (
                products.length > 0 &&
                products[0].tag &&
                products[0].tag.length > 0
              ) {
                category = products[0].tag[0].name;
              }
            } catch (productError) {
              console.warn(
                `Could not fetch products for vendor ${vendor._id}:`,
                productError
              );
            }

            // Get product images
            const productImages = products
              .filter((product: ApiProduct) => product?.image?.secure_url)
              .map((product: ApiProduct) => product.image!.secure_url)
              .slice(0, 5);

            // Use vendor logo or product image, or fallback
            let vendorImage: string;

            // First priority: vendor logo
            if (vendor.logo && vendor.logo.secure_url) {
              vendorImage = vendor.logo.secure_url;
            }
            // Second priority: product images
            else if (productImages.length > 0) {
              vendorImage = productImages[0];
            }
            // Fallback: external placeholder
            else {
              vendorImage = this.getDefaultVendorImage(vendor.companyName);
            }

            return {
              id: vendor._id,
              name: vendor.companyName,
              image: vendorImage,
              rating: this.calculateVendorRating({
                ...vendor,
                totalProducts: giftIdeas,
              }),
              category: category,
              badges: this.generateBadges({
                ...vendor,
                totalProducts: giftIdeas,
              }),
              giftIdeas: giftIdeas,
              productImages: productImages,
            };
          } catch (error) {
            console.error(`Error processing vendor ${vendor._id}:`, error);
            // Return vendor with fallback data
            return {
              id: vendor._id,
              name: vendor.companyName,
              image: this.getDefaultVendorImage(vendor.companyName),
              rating: 4.0,
              category: "General",
              badges: ["New"],
              giftIdeas: 0,
              productImages: [],
            };
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

      // Use vendor logo or product image, or fallback
      let vendorImage: string;

      // First priority: vendor logo
      if (vendor.logo && vendor.logo.secure_url) {
        vendorImage = vendor.logo.secure_url;
      }
      // Second priority: product images
      else if (productImages.length > 0) {
        vendorImage = productImages[0];
      }
      // Fallback: external placeholder
      else {
        vendorImage = this.getDefaultVendorImage(vendor.companyName);
      }

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

    // Use external placeholder service instead of your non-existent /api/placeholder
    return `https://via.placeholder.com/400x240/4F46E5/FFFFFF?text=${encodeURIComponent(
      vendorName
    )}`;
  }

  private static createVendorWithFallback(vendor: ApiVendor): Vendor {
    let vendorImage: string;

    // Try to use vendor logo first
    if (vendor.logo && vendor.logo.secure_url) {
      vendorImage = vendor.logo.secure_url;
    } else {
      vendorImage = this.getDefaultVendorImage(vendor.companyName);
    }

    return {
      id: vendor._id,
      name: vendor.companyName,
      image: vendorImage,
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
