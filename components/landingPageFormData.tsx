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
  firstName: z
    .string(
      {
        required_error: "Please input your first name",
      }
    )
    .min(2, {
      message: "First name must be at least 2 characters.",
    })
    .max(30, {
      message: "First name  must not be longer than 30 characters.",
    }),
    lastName: z
    .string(
      {
        required_error: "Please input your last name",
      }
    )
    .min(2, {
      message: "Last name must be at least 2 characters.",
    })
    .max(30, {
      message: "Last name  must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please input your  email",
    })
    .email(),
    
    phoneNumber: z.string({
      required_error: "Please enter your valid phone number.",
    })
      .min(10, {
        message: "Phone number must be at least 10 characters.",
      })
      .max(14, {
        message: "Phone number must be at most 14 characters.",
      })
    
,    
    gender: z
    .string({
      required_error: "Please select your gender.",
    })
    ,
    dob: z.date({
      required_error: "A date of birth is required.",
    }),
    wish: z.string({
      required_error: "Please enter your birthday wish.",
    }).optional(),

     
  


})

type ProfileFormValues = z.infer<typeof profileFormSchema>



export const LandingPageFormData = () => {

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  })


  function onSubmit(data: ProfileFormValues) {
    toast('Weeshr Form Submitted !!',
    {
      position:"top-right",
      icon: '✅',
      style: {
        borderRadius: '10px',
                color: '#000',
      },
   
    }
  );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full md:flex-row">
     
  
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

<div className='px-6 pt-14 w-full max-w-[600px] md:max-w-[500px]  '>
  

<Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="px-10 space-y-4 bg-white py-14 rounded-2xl ">
       <div className='flex flex-row justify-between gap-[15px] '>
       
       <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
           
              <FormControl>
                <Input placeholder="First Name" {...field} className='w-full' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
           <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Last Name" {...field} className='w-full' />
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
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                type="number"
                placeholder="Your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
     
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
             
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="Others">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
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

<FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal h-11 bg-[#c3c7db32]",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Birth date</span>
                      )}
                      <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            
              <FormMessage />
            </FormItem>
          )}
        />
        
     <div className='flex justify-end pt-10'>
     <Button
        className="px-4 py-4 text-xs transition-all rounded-full hover:scale-105 "
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
