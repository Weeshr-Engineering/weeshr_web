"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {  useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { handleApiError } from "@/lib/handle-err";
import WidthLayout from "@/components/commons/width-layout";





const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters.")
    .max(30, "Full name must not be longer than 30 characters."),
  email: z.string().email("Please enter a valid email address"),
  message: z
    .string()
    .max(200, "Message must not be longer than 200 characters."),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Page: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    setIsLoading(true); // Start loading

    const requestBody = {
      full_name: data.fullName,
      email: data.email,
      message: data.message,
    };
    // console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/contact-us`;
    // console.log("$$$$ User+ " + apiUrl);
    axios
      .post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          toast.success("Form Submitted Successfully!");
          form.reset({
            fullName: "",
            email: "",
            message: "",
          });
        }
      })
      .catch(handleApiError) // Use the utility function for error handling
      .finally(() => {
        setIsLoading(false); // End loading
      });
  }

  return (
    <div className="w-full ">
      <WidthLayout>
        <div className="relative">
          <div className="text-black  ">
            <div className="px-4 pt-16 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold dark:text-gray-100">Contact</h2>
              <p className="max-w-2xl pt-6 pb-6 m-auto  text-[#474B61] w-full md:flex flex-wrap text-lg">
                Want to contact us? Choose an option below and well be happy to
                show you how we can transform companys web experience.
              </p>
            </div>
            <div className="grid  pt-8 pb-16 mx-auto max-w-7xl sm:px-16 md:grid-cols-2 lg:grid-cols-2 gap-y-8 md:gap-x-8 md:gap-y-8 lg:gap-x-8 lg:gap-y-16">
              <div>
                <h2 className="text-lg font-bold text-[#474B61] ">
                  Contact Us
                </h2>
                <p className="max-w-sm mt-4 mb-4  text-[#474B61] w-full md:flex flex-wrap text-base md:w-[350px]">
                  Have something to say? We are here to help. Fill up the form
                  or send email or call phone.
                </p>
                <div className="flex items-center mt-8 space-x-2 text-dark-600 dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="w-4 h-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                    ></path>
                  </svg>
                  <span>Lagos, Nigeria</span>
                </div>
                <div className="flex items-center mt-2 space-x-2 text-dark-600 dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="w-4 h-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    ></path>
                  </svg>
                  <a href="mailto:hello@weeshr.com">hello@weeshr.com</a>
                </div>
                <div className="flex items-center mt-2 space-x-2 text-dark-600 dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="w-4 h-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    ></path>
                  </svg>
                  <a href="tel:+2348143093413">+2348143093413</a>,{" "}
                  <a href="tel:+2348104295016">+2348104295016</a>
                </div>
              </div>
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-[600px] md:max-w-[500px] bg-white/60 p-8 md:p-10 lg:p-14 rounded-2xl  backdrop-blur-2xl"
                >
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <div className="grid gap-4 mb-3 md:grid-cols-1">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Full Name" {...field} />
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
                                  className="min-h-40"
                                  placeholder="Your Message"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          className="w-40 px-6 py-6 text-white transition-all rounded-full hover:scale-105"
                          style={{
                            background:
                              "linear-gradient(90deg, #0CC990 0%, #6A70FF 35.94%, #41C7D9 66.15%, #AEE219 100%)",
                          }}
                          type="submit"
                          disabled={isLoading} // Disable the button when loading
                        >
                          {isLoading ? (
                            <Icon
                              height={50}
                              width={50}
                              icon="eos-icons:three-dots-loading"
                            />
                          ) : (
                            "Submit"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </WidthLayout>
    </div>
  );
};

export default Page;
