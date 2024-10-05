// utils/handleApiError.ts
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Disable no-explicit-any for this function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleApiError(error: any) {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data.message;

    switch (status) {
      case 400:
      case 401:
      case 403:
      case 422:
      case 500:
        if (message) toast.error(message);
        break;
      default:
        if (message) toast.error(message);
        break;
    }
  } else if (error.request) {
    toast.error("Submission unsuccessful. No response received.");
  } else {
    toast.error("Submission unsuccessful. An error occurred.");
  }
}

export function useLoginUserErrorHandler() {
  const router = useRouter();

  // Disable no-explicit-any for this function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (error: any) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data.message || "An error occurred";

      switch (status) {
        case 401:
          // Handle unauthorized error
          toast.error("Session expired. Please log in again.");
          router.push("/login"); // Redirect to login
          break;
        case 400:
        case 403:
        case 422:
        case 500:
          toast.error(message);
          break;
        default:
          toast.error(message);
          break;
      }
    } else if (error.request) {
      toast.error("Submission unsuccessful. No response received.");
    } else {
      toast.error("Submission unsuccessful. An error occurred.");
    }
  };

  return { handleError };
}
