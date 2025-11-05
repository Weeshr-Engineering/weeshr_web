// services/auth.service.ts
import ApiBase from "@/lib/api-base";

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  gender: string;
  phone: {
    countryCode: string;
    phoneNumber: string;
  };
  dob: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: any;
    token: string;
  };
}

class AuthService extends ApiBase {
  constructor() {
    super();
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await this.post<{
        success: boolean;
        message: string;
        data?: any;
      }>("/register", userData);

      return {
        success: true,
        message: "Account created successfully!",
        data: response.data,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async loginWithPin(email: string, pin: string): Promise<AuthResponse> {
    try {
      const response = await this.post<{
        success: boolean;
        message: string;
        data?: any;
      }>("/login/pin", { email, pin });

      return {
        success: true,
        message: "Login successful!",
        data: response.data,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async getProfile(): Promise<AuthResponse> {
    try {
      const response = await this.get<{
        success: boolean;
        message: string;
        data?: any;
      }>("/user/profile");

      return {
        success: true,
        message: "Profile fetched successfully",
        data: response.data,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): AuthResponse {
    console.error("API Error:", error);

    if (error.response) {
      const errorMessage = error.response.data?.message || "Request failed";

      if (error.response.status === 400) {
        return {
          success: false,
          message: errorMessage || "Invalid input data",
        };
      } else if (error.response.status === 409) {
        return {
          success: false,
          message: errorMessage || "User already exists",
        };
      } else if (error.response.status === 401) {
        return { success: false, message: errorMessage || "Unauthorized" };
      } else if (error.response.status === 422) {
        return { success: false, message: errorMessage || "Validation failed" };
      } else {
        return { success: false, message: errorMessage || "Request failed" };
      }
    } else if (error.request) {
      return {
        success: false,
        message: "Network error. Please check your connection.",
      };
    } else {
      return { success: false, message: "An unexpected error occurred." };
    }
  }
}

export const authService = new AuthService();
