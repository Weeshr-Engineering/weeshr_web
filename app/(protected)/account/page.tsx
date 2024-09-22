"use client";

import { useEffect, useState } from "react";
import WidthLayout from "@/components/width-layout";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoginUserErrorHandler } from "@/lib/handle-err";
import { useRouter } from "next/navigation"; // Import useRouter
import toast from "react-hot-toast";
import Footer from "@/components/footer_err";
import InterfaceLayout from "@/components/err-Interface-layout";

import { faqList } from "../../../lib/constants/acc-deletion-faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HomePage: React.FC = () => {
  const [fullName, setFullName] = useState<string>("");
  const { handleError } = useLoginUserErrorHandler(); // Use the custom hook
  const router = useRouter(); // Initialize router
  const [isLoading, setIsLoading] = useState<boolean>(false); // Manage loading state

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch the user profile
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (response.status === 200) {
          const { firstName, lastName } = response.data.data;
          setFullName(`${firstName} ${lastName}`);
        } else {
          // Handle non-200 status codes gracefully
          handleError({
            response: {
              status: response.status,
              data: { message: "Failed to fetch user profile." },
            },
          });
        }
      } catch (error) {
        handleError(error); // Use the custom error handler
      }
    };

    fetchUserProfile();
  }, [handleError]); // Ensure handleError is included in the dependency array

  const handleDeleteAccount = async () => {
    setIsLoading(true); // Start loading state

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/user/account`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      toast.success(
        "Your account has been deactivated. You will be logged out shortly.",
        {
          duration: 5000,
        }
      );

      setTimeout(() => {
        localStorage.removeItem("authToken");
        router.push("/login");
      }, 5000);
    } catch (error) {
      handleError(error);
      setIsLoading(false); // Stop loading state if there's an error
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        console.error("No auth token found");
        router.push("/login"); // Redirect to login page if not authenticated
        return;
      }

      try {
        // Fetch the user profile
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.status === 200) {
          const { firstName, lastName } = response.data.data;
          setFullName(`${firstName} ${lastName}`);
        } else {
          // Handle non-200 status codes gracefully
          handleError({
            response: {
              status: response.status,
              data: { message: "Failed to fetch user profile." },
            },
          });
        }
      } catch (error) {
        handleError(error); // Use the custom error handler
      }
    };

    fetchUserProfile();
  }, [handleError, router]); // Ensure handleError and router are included in the dependency array

  return (
    <InterfaceLayout>
     
    <WidthLayout narrow={true}>
      
      <div className="h-screen px-[0.5px]  pt-40 mx-auto text-black">

        {/* section1 */}

        <div className="flex flex-col items-center">
          <h1 className="w-9/12 mb-4 text-center text-h2">
            Weeshr so sorry to see you go
          </h1>
          <p className="text-muted-foreground">
            You’re about to leave the weeshr giftiverse
          </p>
        </div>

        {/* section2 */}

        <div className="flex flex-col md:flex-row w-full p-6 px-4 mt-16 rounded-lg bg-white/60 backdrop-blur-3xl">
          <div className="w-full md:w-1/2 px-4">
                      <Image
              alt="image"
              src="https://res.cloudinary.com/drykej1am/image/upload/v1724061821/weeshr_website/Vector_50_yna0vu.png"
              width={50}
              height={50}
            ></Image>

            <h3 className="h-8 pt-2 font-semibold capitalize text-h4">
              {fullName ? (
                fullName + ","
              ) : (
                <Skeleton className="h-4 w-[200px]" />
              )}{" "}
            </h3>
            <h5 className="py-1 font-normal text-pb pt-4">
              Are about to delete your weeshr account
            </h5>
          
          <div className="p-5 mt-4 bg-white rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-md">
              <Icon icon="hugeicons:alert-02" height={"30"} width={"30"} />
            </div>
            <h3 className="pt-3 pb-1 font-semibold text-h6">Disclaimer</h3>
            <div className="space-y-3 text-muted-foreground">
              <p>
                Account deletion is permanent. Your data, wishes, weeshr connect
                and moments will be erased. Shared content may remain visible.
                This action cannot be undone.
              </p>
              <p>
                Account deletion is permanent. Your data, wishes, weeshr connect
                and moments will be erased. Shared content may remain visible.
                This action cannot be undone.
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleDeleteAccount}
            size={"xl"}
            variant={"outline"}
            className="w-full font-semibold text-pb"
          >
            Temporarily Deactivate
          </Button>
            
          </div>

          <div className="w-full md:w-1/2 mt-8 md:mt-0 md:ml-4">          
          <h3 className="pt-3 pb-10  font-semibold text-h3 w-full md:w-1/2 mt-8 md:mt-0 md:ml-4">
              {" "}
              Account
              <br />
              Deletion
              <br />
              FAQs
            </h3>
            <Accordion type="single" collapsible className="w-full md:w-full mt-8 md:mt-0 md:ml-4 ">
            {faqList.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="px-3 py-1 my-2 bg-primary-foreground rounded-lg"
              >
                <AccordionTrigger className="text-left ">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-left text-muted-foreground">
                  <p className="">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

            {/* <div className="flex justify-between mt-4">
              
                    <button className="flex flex-col items-center space-y-2">
                    <span className="text-4xl">😡</span>
                    <span className="text-sm">Terrible</span>
                    </button>
                    <button className="flex flex-col items-center space-y-2">
                    <span className="text-4xl">😔</span>
                    <span className="text-sm">Bad</span>
                    </button>
                    <button className="flex flex-col items-center space-y-2">
                    <span className="text-4xl">😐</span>
                    <span className="text-sm">Okay</span>
                    </button>
                    <button className="flex flex-col items-center space-y-2">
                    <span className="text-4xl">😄</span>
                    <span className="text-sm">Good</span>
                    </button>
                    <button className="flex flex-col items-center space-y-2">
                    <span className="text-4xl">🥳</span>
                    <span className="text-sm">Good</span>
                    </button>
            </div> */}
            {/* <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">
                  Reason for deleting account
                </label>
                <select className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option>Select One</option>
                  <option>Privacy concerns</option>
                  <option>Too much spam</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional information
                  </label>
                   <textarea
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    rows={4}
              />
            </div> */}

             {/* <Button
                size={"xl"}
                className="w-full mt-6 font-semibold text-white bg-[#4145A7]"
              >
                Delete account
            </Button> */}
          </div>
        </div>
        <div className="relative pt-16">
            <Image
              alt="image"
              src="https://res.cloudinary.com/drykej1am/image/upload/v1724332972/weeshr_website/Untitled_2-1536x735_2_jkwrnp.png"
              width={150}
              height={100}
              className="absolute top-0 -right-8"
            ></Image>
          
          </div>
{/* 
          <div className="flex flex-col md:flex-row w-full p-6 px-4 mt-16 bg-transparent ">

          <h3 className="pt-3 pb-10  font-semibold text-h3 w-full md:w-1/2 mt-8 md:mt-0 md:ml-4">
              {" "}
              Account
              <br />
              Deletion
              <br />
              FAQs
            </h3>
          <Accordion type="single" collapsible className="w-full md:w-1/2 mt-8 md:mt-0 md:ml-4 ">
            {faqList.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="px-3 py-1 my-2 bg-primary-foreground rounded-lg"
              >
                <AccordionTrigger className="text-left ">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-left text-muted-foreground">
                  <p className="">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          </div> */}
          <Footer />
      </div>
      
    </WidthLayout>
  
    </InterfaceLayout>

  );
};

export default HomePage;
