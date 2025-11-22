// services/checkout.service.ts
import axios from "axios";

export interface CheckoutRequest {
  cartId: string;
  receiverName: string;
  email: string;
  shippingAddress: string;
  deliveryDate: string;
  frequency: "once" | "weekly" | "monthly"; // Changed to lowercase
  currency: "NGN" | "USD" | "EUR" | "GBP";
}

export interface CheckoutResponse {
  code: number;
  message: string;
  data?: {
    checkoutId: string;
    paymentUrl?: string;
    transactionReference?: string;
  };
  error?: string;
}

class CheckoutService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL;

  async processCheckout(
    checkoutData: CheckoutRequest
  ): Promise<CheckoutResponse> {
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("User not authenticated");
      }

      const response = await axios.post(
        `${this.baseURL}/market/carts/checkout`,
        checkoutData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        code: response.status,
        message: "Checkout processed successfully",
        data: response.data.data,
      };
    } catch (error: any) {
      console.error("Checkout processing error:", error);

      return {
        code: error.response?.status || 500,
        message: error.response?.data?.message || "Checkout processing failed",
        error: error.message,
      };
    }
  }

  // Optional: Get checkout status
  async getCheckoutStatus(checkoutId: string) {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(
        `${this.baseURL}/market/checkouts/${checkoutId}/status`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching checkout status:", error);
      throw error;
    }
  }
}

export const checkoutService = new CheckoutService();
