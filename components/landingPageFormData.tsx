"use client"

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import toast from 'react-hot-toast';




import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { Calendar } from "@/components/ui/calendar"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"


const profileFormSchema = z.object({
  preferredName: z
    .string(
      {
        required_error: "Please input your preferred name",
      }
    )
    .min(2, {
      message: "First name must be at least 2 characters.",
    })
    .max(30, {
      message: "Preferred name  must not be longer than 30 characters.",
    }),
    wish: z
    .string(
      {
        required_error: "Please input your preferred name",
      }
    )
    .optional(),
  email: z
    .string({
      required_error: "Please input your  email",
    })
    .email({
      message: "Please enter a valid email address",
    }),
   

    
})

type ProfileFormValues = z.infer<typeof profileFormSchema>



export const LandingPageFormData = () => {

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  })

  function onSubmit(data: ProfileFormValues) {
    const requestBody = {
      name: data.preferredName,
      email: data.email,
      wish: data.wish || 'none',
    };
  
    const apiUrl = 'https://api.staging.weeshr.com/api/v1/mailinglist/subscribe/d02856a4df';
  
    console.log('Request Body:', requestBody); // Log the request body
    console.log('API URL:', apiUrl); // Log the API URL
  
    toast.promise(
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }).then((response) => {
        if (!response.ok) {
          console.error('Error fetching', response);
          throw new Error('Network response was not ok');
        }
        return response.json();
      }),
      {
        loading: 'Saving...',
        success: <b>Weeshr Form Submitted!</b>,
        error: (error) => `Submission unsuccessful. Error: ${error.message}`,


      }
    ).then(() => {
      // console.log('Form submitted successfully!'); // Log success message
      form.reset({
        preferredName: '',
        email: '',
        wish: '',
      });
    }).catch((error) => {
      // console.error('Error:', error); // Log any errors that occur
      // Additional error handling, such as displaying an error message to the user
    });
  }

  
 
  // function onSubmit(data: ProfileFormValues) {
  //   const requestBody = {
  //     name: data.preferredName,
  //     email: data.email,
  //     feedback: data.wish,
  //   };
  
  //   toast.promise(
  //     fetch('https://api.staging.weeshr.com/api/v1/user-feedback', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(requestBody),
  //       mode: 'no-cors',
  //     }).then((response) => response.json()),
  //     {
  //       loading: 'Saving...',
  //       success: <b>Weeshr Form Submitted!</b>,
  //       error: <b>Could not save.</b>,
  //     }
  //   ).then(() => {
  //     form.reset(
  //       {
  //         preferredName: "",
  //         email: "",
  //         wish: "",
  //       }
  //     );// Reset the form after it has been saved
  //   });
  // }
  

 
  

  return (
    <div className="flex flex-col items-center justify-center w-full pt-10 md:flex-row md:pt-0">
     
  
  <div className='md:-translate-y-[90px] md:pl-10 '>


<div className='flex  text-left text-[#020721] flex-col text-4xl leading-[35px]  justify-start items-start  h-full '>
<h2 className=''>
Join our waitlist 
</h2>
<h2 className=''>
 and make wishes 
</h2>
<h2 className=''>
 come alive
</h2>


</div>
<h4 className='hidden  text-[#474B61] w-full md:flex flex-wrap text-lg pt-10 md:w-[350px]'>
Weeshr is bringing happiness to your in boxes! Join our waitlist to be the first to know
</h4> 
</div>

<div className='px-6 md:pt-8 pt-14  w-full max-w-[600px] md:max-w-[500px]'>
  

<Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full px-10 space-y-4 bg-white py-14 rounded-2xl ">
       <div className='flex flex-row justify-between gap-[15px] '>
       
       <FormField
          control={form.control}
          name="preferredName"
          render={({ field }) => (
            <FormItem>
           
              <FormControl>
                <Input placeholder="Your preferred name" {...field} className='w-full' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
       </div>

       <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Your email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
    
     
       
        <FormField
          control={form.control}
          name="wish"
          render={({ field }) => (
            <FormItem>
            
              <FormControl>
                <Textarea
                  placeholder="What would you wish for your birthday?"
                  className="resize-none"
                
                  {...field}
                />
              </FormControl>
      
              <FormMessage />
            </FormItem>
          )}
        />


        
     <div className='flex justify-end pt-10'>
     <Button
        className="px-6 py-6 rounded-full transimtion-all text-s hover:scale-105 "
          style={{
            background:
              'linear-gradient(90deg, #0CC990 0%, #6A70FF 35.94%, #41C7D9 66.15%, #AEE219 100%)',
          }}
        type="submit">Join Wishlist</Button>
     </div>
    
      </form>
    </Form>
    </div>
    <div>
</div>

    
      


    </div>
  )
}
