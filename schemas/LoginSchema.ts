import * as z from "zod";

export const ContactFormSchema = z.object({
	full_name: z
		.string()
		.min(2, "Full name must be at least 2 characters.")
		.max(30, "Full name must not be longer than 30 characters."),
	email: z.string().email("Please enter a valid email address"),
	message: z
		.string()
		.max(200, "Message must not be longer than 200 characters."),
});
