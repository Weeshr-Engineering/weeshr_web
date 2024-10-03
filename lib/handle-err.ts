import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type ApiError = {
  response?: {
    status: number;
    data: {
      message: string;
    };
  };
  request?: unknown;
  message?: string;
};

export function handleApiError(error: ApiError) {
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

  const handleError = (error: ApiError) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data.message || "An error occurred";

      switch (status) {
        case 401:
          toast.error("Session expired. Please log in again.");
          router.push("/login");
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
