import { ContactFormSchema } from "@/schemas/LoginSchema";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { handleApiError } from "@/lib/handle-err";

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/contact-us`;

export const contact = (value: z.infer<typeof ContactFormSchema>) => {
	axios
		.post(baseUrl, value, {
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then((response) => {
			if (response.status === 200 || response.status === 201) {
				toast.success("Form Submitted Successfully!");
			}
		})
		.catch(handleApiError); // Use the utility function for error handling
};
