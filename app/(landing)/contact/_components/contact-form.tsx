"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { ContactFormSchema } from "@/schemas/LoginSchema";
import { useState } from "react";
import { contact } from "@/service/contact";

const ContactForm = () => {
	const [loading, setLoading] = useState(false);

	const form = useForm<z.infer<typeof ContactFormSchema>>({
		resolver: zodResolver(ContactFormSchema),
		mode: "onChange",
		defaultValues: {
			full_name: "",
			email: "",
			message: "",
		},
	});

	function onSubmit(data: z.infer<typeof ContactFormSchema>) {
		setLoading(true);
		contact(data);
		setLoading(false);
		form.reset();
	}

	return (
		<div>
			<motion.div
				initial={{ opacity: 0, scale: 0.5 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className="p-4 lg:p-8">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="grid gap-4 mb-3 md:grid-cols-1">
							<FormField
								control={form.control}
								name="full_name"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												placeholder="Full Name"
												{...field}
												className="bg-lightBlue"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												type="email"
												placeholder="Email Address"
												{...field}
												className="bg-lightBlue"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="message"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Textarea
												className="min-h-40 bg-lightBlue"
												placeholder="Your Message"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex justify-center lg:justify-end pt-5">
							<Button
								className="w-full lg:max-w-[50%] px-10 py-4 text-xs text-white transition-all rounded-md hover:scale-105 bg-core"
								type="submit"
								disabled={loading}>
								{loading ? (
									<Icon
										height={50}
										width={50}
										icon="eos-icons:three-dots-loading"
									/>
								) : (
									"Send message"
								)}
							</Button>
						</div>
					</form>
				</Form>
			</motion.div>
		</div>
	);
};

export default ContactForm;
