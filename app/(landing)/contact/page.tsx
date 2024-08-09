"use client";

import React from "react";
import Image from "next/image";
import Footer from "@/components/footer";
import WidthLayout from "@/components/width-layout";
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
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { handleApiError } from "@/lib/handle-err";

// Define the type for social media links
interface SocialMediaLink {
  name: string;
  url: string;
  icon: string;
}

// You would typically define this array in a separate file or fetch it from an API
const socialMediaLinks: SocialMediaLink[] = [
  // Add your social media links here, for example:
  // { name: 'Facebook', url: 'https://facebook.com/weeshr', icon: '/images/facebook-icon.svg' },
  // { name: 'Twitter', url: 'https://twitter.com/weeshr', icon: '/images/twitter-icon.svg' },
  // Add more as needed
];

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
  const currentYear = new Date().getFullYear();
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
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/contact-us`;
    console.log("$$$$ User+ " + apiUrl);
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
      <>
        <div className="relative">
          <div
            className="text-black bg-white pb-[240px] pt-[100px]"
            style={{
              background: "linear-gradient(180deg, #FFF 0.11%, #E4E6F5 99.89%)",
            }}
          >
            <div className="px-4 pt-16 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold dark:text-gray-100">Contact</h2>
              <p className="max-w-2xl pt-6 pb-6 m-auto  text-[#474B61] w-full md:flex flex-wrap text-lg">
                Want to contact us? Choose an option below and well be happy to
                show you how we can transform companys web experience.
              </p>
            </div>
            <div className="grid px-10 pt-8 pb-16 mx-auto max-w-7xl sm:px-16 md:grid-cols-2 lg:grid-cols-2 gap-y-8 md:gap-x-8 md:gap-y-8 lg:gap-x-8 lg:gap-y-16">
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
                  className="max-w-[600px] md:max-w-[500px]"
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
          <div className="absolute bottom-0 w-full translate-y-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#4537BA"
                fill-opacity="1"
                d="M0,128L26.7,149.3C53.3,171,107,213,160,245.3C213.3,277,267,299,320,266.7C373.3,235,427,149,480,138.7C533.3,128,587,192,640,181.3C693.3,171,747,85,800,90.7C853.3,96,907,192,960,240C1013.3,288,1067,288,1120,277.3C1173.3,267,1227,245,1280,218.7C1333.3,192,1387,160,1413,144L1440,128L1440,320L1413.3,320C1386.7,320,1333,320,1280,320C1226.7,320,1173,320,1120,320C1066.7,320,1013,320,960,320C906.7,320,853,320,800,320C746.7,320,693,320,640,320C586.7,320,533,320,480,320C426.7,320,373,320,320,320C266.7,320,213,320,160,320C106.7,320,53,320,27,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>
      </>
      <div className="py-[50px]">
        <Footer />
      </div>{" "}
    </div>
  );
};

export default Page;
