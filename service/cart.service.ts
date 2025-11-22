// services/cart.service.ts
import axios from "axios";
import { BasketItem } from "@/lib/BasketItem";

export interface CartItem {
  productId: string;
  quantity: number;
  price?: number;
}

export interface CartData {
  _id?: string;
  userId: string;
  items: CartItem[];
  totalPrice?: number;
  isActive?: boolean;
}

export interface CartResponse {
  code: number;
  message: string;
  data?: CartData;
  error?: string;
}

class CartService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL;
  private currentCartId: string | null = null;

  // Add items to cart (creates new cart or updates existing)
  async addItemsToCart(cartData: CartData): Promise<CartResponse> {
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("User not authenticated");
      }

      let response;

      if (this.currentCartId) {
        // Update existing cart
        response = await axios.put(
          `${this.baseURL}/market/carts/${this.currentCartId}`,
          cartData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Create new cart
        response = await axios.post(
          `${this.baseURL}/market/carts/add`,
          cartData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Store cart ID for future updates
        if (response.data.data?._id) {
          this.currentCartId = response.data.data._id;
          localStorage.setItem("currentCartId", response.data.data._id);
        }
      }

      return {
        code: response.status,
        message: "Cart updated successfully",
        data: response.data.data,
      };
    } catch (error: any) {
      console.error("Cart operation error:", error);

      return {
        code: error.response?.status || 500,
        message: error.response?.data?.message || "Failed to update cart",
        error: error.message,
      };
    }
  }

  // Remove item from cart
  async removeItemFromCart(
    userId: string,
    productId: string
  ): Promise<CartResponse> {
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("User not authenticated");
      }

      const response = await axios.post(
        `${this.baseURL}/market/carts/remove-item`,
        {
          userId,
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        code: response.status,
        message: "Item removed from cart successfully",
        data: response.data.data,
      };
    } catch (error: any) {
      console.error("Remove item error:", error);

      return {
        code: error.response?.status || 500,
        message:
          error.response?.data?.message || "Failed to remove item from cart",
        error: error.message,
      };
    }
  }

  // Clear entire cart
  async clearCart(cartId: string): Promise<CartResponse> {
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("User not authenticated");
      }

      const response = await axios.delete(
        `${this.baseURL}/market/carts/${cartId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Clear local cart ID
      this.currentCartId = null;
      localStorage.removeItem("currentCartId");

      return {
        code: response.status,
        message: "Cart cleared successfully",
        data: response.data.data,
      };
    } catch (error: any) {
      console.error("Clear cart error:", error);

      return {
        code: error.response?.status || 500,
        message: error.response?.data?.message || "Failed to clear cart",
        error: error.message,
      };
    }
  }

  // Get user cart
  async getUserCart(userId: string): Promise<CartResponse> {
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("User not authenticated");
      }

      const response = await axios.get(
        `${this.baseURL}/market/carts/active/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.data?._id) {
        this.currentCartId = response.data.data._id;
        localStorage.setItem("currentCartId", response.data.data._id);
      }

      return {
        code: response.status,
        message: "Cart fetched successfully",
        data: response.data.data,
      };
    } catch (error: any) {
      console.error("Get cart error:", error);

      return {
        code: error.response?.status || 500,
        message: error.response?.data?.message || "Failed to fetch cart",
        error: error.message,
      };
    }
  }

  // Initialize cart service with existing cart ID
  initialize() {
    this.currentCartId = localStorage.getItem("currentCartId");
  }

  // Get current cart ID
  getCurrentCartId(): string | null {
    return this.currentCartId;
  }

  // Clear current cart ID (on logout)
  clearCurrentCart() {
    this.currentCartId = null;
    localStorage.removeItem("currentCartId");
  }
}

export const cartService = new CartService();

// Initialize cart service on import
if (typeof window !== "undefined") {
  cartService.initialize();
}
