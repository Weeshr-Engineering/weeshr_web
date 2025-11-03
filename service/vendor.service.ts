import { fetchVendorsByCategory, fetchProductsByVendor } from "@/lib/api";

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
  categories: string[];
  totalProducts: number;
}

export interface ProductImage {
  secure_url: string;
  url: string;
}

export interface ApiProduct {
  _id: string;
  image: ProductImage;
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
  productImages: string[]; // Store multiple product images for fallback
}

/**
 * Service for vendor-related operations
 */
export class VendorService {
  /**
   * Fetch vendors by category ID and get product images for each vendor
   */
  static async getVendorsByCategory(categoryId: string): Promise<Vendor[]> {
    try {
      console.log(`Fetching vendors for category: ${categoryId}`);
      const apiVendors: ApiVendor[] = await fetchVendorsByCategory(categoryId);

      console.log(
        `Found ${apiVendors.length} vendors for category ${categoryId}`
      );

      // Fetch vendors with their product images
      const vendorsWithImages = await Promise.all(
        apiVendors.map((vendor) => this.enrichVendorWithProductImages(vendor))
      );

      return vendorsWithImages;
    } catch (error) {
      console.error("Error fetching vendors:", error);
      return [];
    }
  }

  /**
   * Enrich vendor data with product images
   */
  private static async enrichVendorWithProductImages(
    vendor: ApiVendor
  ): Promise<Vendor> {
    try {
      // Fetch products for this vendor to get images
      const products = await fetchProductsByVendor(vendor._id);
      const productImages = products
        .filter((product: ApiProduct) => product.image?.secure_url)
        .map((product: ApiProduct) => product.image.secure_url)
        .slice(0, 5); // Get up to 5 product images for fallback

      // Select the best image for the vendor
      const vendorImage = this.selectBestVendorImage(
        productImages,
        vendor.companyName
      );

      return {
        id: vendor._id,
        name: vendor.companyName,
        image: vendorImage,
        rating: this.calculateVendorRating(vendor),
        category: vendor.categories[0] || "Food",
        badges: this.generateBadges(vendor),
        giftIdeas: vendor.totalProducts || 0,
        productImages: productImages, // Store all product images for fallback
      };
    } catch (error) {
      console.error(`Error fetching products for vendor ${vendor._id}:`, error);
      // Return vendor with fallback image
      return this.createVendorWithFallback(vendor);
    }
  }

  /**
   * Select the best image for vendor display
   */
  private static selectBestVendorImage(
    productImages: string[],
    vendorName: string
  ): string {
    if (productImages.length === 0) {
      return this.getDefaultVendorImage(vendorName);
    }

    // Prefer images that might look good as cover images
    // You could add more sophisticated logic here based on image dimensions, aspect ratio, etc.
    return productImages[0]; // Use the first product image for now
  }

  /**
   * Get default vendor image
   */
  private static getDefaultVendorImage(vendorName: string): string {
    // Use a food-related placeholder or the vendor name
    const foodPlaceholders = ["🍕", "🍔", "🍣", "🍜", "🌮", "🍝", "🍛", "🥗"];
    const randomEmoji =
      foodPlaceholders[Math.floor(Math.random() * foodPlaceholders.length)];

    return `/api/placeholder/400/240?text=${encodeURIComponent(
      vendorName
    )}&emoji=${randomEmoji}`;
  }

  /**
   * Create vendor with fallback image when product fetch fails
   */
  private static createVendorWithFallback(vendor: ApiVendor): Vendor {
    return {
      id: vendor._id,
      name: vendor.companyName,
      image: this.getDefaultVendorImage(vendor.companyName),
      rating: this.calculateVendorRating(vendor),
      category: vendor.categories[0] || "Food",
      badges: this.generateBadges(vendor),
      giftIdeas: vendor.totalProducts || 0,
      productImages: [],
    };
  }

  /**
   * Calculate vendor rating based on various factors
   */
  private static calculateVendorRating(vendor: ApiVendor): number {
    let rating = 4.0; // Base rating

    // Increase rating based on vendor properties
    if (vendor.totalProducts > 10) rating += 0.5;
    if (vendor.totalProducts > 5) rating += 0.3;
    if (vendor.status === "published") rating += 0.2;

    // Ensure rating is between 4.0 and 5.0
    return Math.min(Math.max(rating, 4.0), 5.0);
  }

  /**
   * Generate badges based on vendor properties
   */
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

    // Ensure we always have at least one badge
    if (badges.length === 0) {
      badges.push("New");
    }

    return badges.slice(0, 3); // Limit to 3 badges
  }

  /**
   * Get multiple product images for a vendor (for carousel or fallback)
   */
  static async getVendorProductImages(vendorId: string): Promise<string[]> {
    try {
      const products = await fetchProductsByVendor(vendorId);
      return products
        .filter((product: ApiProduct) => product.image?.secure_url)
        .map((product: ApiProduct) => product.image.secure_url);
    } catch (error) {
      console.error(
        `Error fetching product images for vendor ${vendorId}:`,
        error
      );
      return [];
    }
  }
}
