// services/cart.service.ts
import axios from "axios";
import { BasketItem } from "@/lib/BasketItem";

export interface AddToCartRequest {
  userId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface AddToCartResponse {
  code: number;
  message: string;
  data?: any;
  error?: string;
}

class CartService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL;

  async addItemsToCart(cartData: AddToCartRequest): Promise<AddToCartResponse> {
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("User not authenticated");
      }

      const response = await axios.post(
        `${this.baseURL}/market/carts/add`,
        cartData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        code: response.status,
        message: "Cart items added successfully",
        data: response.data,
      };
    } catch (error: any) {
      console.error("Add to cart error:", error);

      return {
        code: error.response?.status || 500,
        message: error.response?.data?.message || "Failed to add items to cart",
        error: error.message,
      };
    }
  }

  // Get user profile to get userId
  async getUserProfile() {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(`${this.baseURL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }
}

export const cartService = new CartService();
