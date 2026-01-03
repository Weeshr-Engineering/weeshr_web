import axios from "axios";
import toast from "react-hot-toast";
import { z } from "zod";

// ✅ Define Zod schema for validation
export const SignupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  userName: z.string().min(1, "Username is required"),
  gender: z.string().min(1, "Gender is required"),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      return selectedDate < today;
    }, "Date of birth must be in the past"),
  phone: z.object({
    countryCode: z.string().min(1, "Country code is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
  }),
});

export type SignupFormData = z.infer<typeof SignupSchema>;

export interface SignupResponse {
  code: number;
  message: string;
  data: {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      emailVerified: boolean;
      avatar: string | null;
      token: string;
      devices: any[];
    };
  };
  error: null | string;
}

class SignupService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;

  async register(userData: SignupFormData): Promise<SignupResponse> {
    try {
      // ✅ Validate with Zod before sending
      const validatedData = SignupSchema.parse(userData);

      const response = await axios.post<SignupResponse>(
        `${this.baseUrl}/register`,
        validatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.code === 200) {
        const { user } = response.data.data;
        localStorage.setItem("userId", user._id);
        localStorage.setItem("authToken", user.token);

        toast.success(response.data.message || "Account created successfully!");
        return response.data;
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      // ✅ Handle Zod errors gracefully
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
        throw new Error("Validation failed");
      }

      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  }

  async updateProfile(userData: SignupFormData): Promise<SignupResponse> {
    try {
      const validatedData = SignupSchema.parse(userData);
      const token = localStorage.getItem("authToken");

      const response = await axios.patch<SignupResponse>(
        `${this.baseUrl}/user/settings/identity`,
        validatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200 || response.data.code === 201) {
        toast.success(response.data.message || "Profile updated successfully!");
        return response.data;
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
        throw new Error("Validation failed");
      }
      const errorMessage =
        error.response?.data?.message || "Update failed. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  }
}

export const signupService = new SignupService();
