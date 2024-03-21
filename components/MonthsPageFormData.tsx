'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import React, { useState } from 'react'
import axios from 'axios'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

import { Calendar } from '@/components/ui/calendar'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { motion } from 'framer-motion'
import MonthsPage from '../app/(landing)/[id]/page'

const profileFormSchema = z.object({
  preferredName: z
    .string({
      required_error: 'Please input your preferred name'
    })
    .min(2, {
      message: 'First name must be at least 2 characters.'
    })
    .max(30, {
      message: 'Preferred name  must not be longer than 30 characters.'
    }),
  wish: z
    .string({
      required_error: 'Please input your preferred name'
    })
    .max(200, {
      message: 'Wish  must not be longer than 200 characters.'
    })
    .optional(),
  email: z
    .string({
      required_error: 'Please input your  email'
    })
    .email({
      message: 'Please enter a valid email address'
    }),
  dob: z.any().optional(),
  phone: z.string().optional()
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export const MonthsPageFormData = ({ month }: { month: string }) => {
  const [isDateInput, setIsDateInput] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onChange'
  })

  function onSubmit(data: ProfileFormValues) {
    console.log('Received dob:', data.dob);

    
    const requestBody: any = {
      name: data.preferredName,
      email: data.email,
      wish: data.wish || 'none',
      phone: data.phone || 'none',
      month: month || 'none'
    }

    if (data.dob) {
      // Convert the timestamp to a Date object
      const dobDate = new Date(data.dob);
      
      // Check if the Date object is valid
      if (!isNaN(dobDate.getTime())) {
        // Convert the Date object to string in the desired format using dayjs
        requestBody.dob = dayjs(dobDate).format('DD-MM-YYYY');
        
        // Log the converted dob
        console.log('Converted dob:', requestBody.dob);
      } else {
        console.error('Invalid date value:', data.dob);
      }
    }

    const apiUrl = 'https://api.staging.weeshr.com/api/v1/mailinglist/subscribe/d02856a4df'

    console.log('Request Body:', requestBody) // Log the request body
    console.log('API URL:', apiUrl) // Log the API URL

    axios
      .post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        console.log('Response:', response.data)
        toast.success('Weeshr Form Submitted!')
        form.reset({
          preferredName: '',
          email: '',
          wish: '',
          dob: '', 
          phone: ''
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        if (error.response) {
          // The request was made and the server responded with a status code that falls out of the range of 2xx
          console.error('Server Error:', error.response.data)
          console.error('Status:', error.response.status)
          console.error('Headers:', error.response.headers)
          toast.error(error.response.data.message || 'An error occurred.')
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Request Error:', error.request)
          toast.error('Submission unsuccessful. No response received.')
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('General Error:', error.message)
          toast.error('Submission unsuccessful. An error occurred.')
        }
      })
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

  const handleFocus = () => {
    setIsDateInput(true)
  }

  return (
    <div className="z-50 flex flex-col items-center justify-center w-full md:flex-row md:pt-10">
      <div className="flex flex-col items-center justify-center w-auto py-10 md:justify-start md:pt-0 md:items-start lg:pr-28">
        <Image
          alt="image"
          src="https://res.cloudinary.com/drykej1am/image/upload/v1704590628/weeshr_website/c9jufgt5n7dm009cehr4.png"
          width={150}
          height={150}
        ></Image>

        <div className=" text-center md:text-left text-[#474B61]  text-4xl leading-[35px]  justify-start md:items-start  h-full pt-10">
          <h2 className="leading-10">We know your birthday</h2>
          <h2 className="leading-10">
            is in <span className="font-bold capitalize"> {month}</span>
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <h4 className="  text-black flex flex-wrap text-lg pt-10 md:w-[370px] text-center  items-center md:text-left w-11/12 sm:w-10/12 md:translate-x-[2px] font-medium justify-center md:justify-start">
            Join 5000+ people celebrating their birthday in{' '}
            <span className="capitalize">{month}</span>, we have a gift for you!! 🥳🥳
          </h4>
        </div>
      </div>
      <motion.div
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 100 }}
        className="px-6 md:pt-8 pt-14  w-full max-w-[500px] md:max-w-[500px]"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full px-10 space-y-4 bg-white py-14 rounded-2xl "
          >
            <div className="flex flex-row justify-between gap-[15px] ">
              <FormField
                control={form.control}
                name="preferredName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Your preferred name" {...field} className="w-full" />
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

<FormField
  control={form.control}
  name="dob"
  render={({ field }) => (
    <FormItem>
      <FormControl>
        <div className="col">
          <div className="form-group">
            <div className="mb-4 input-group">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{
                    bgcolor: '#c3c7db32',
                    width: '100%'
                  }}
                  value={field.value} // Manually handle value
                  onChange={(date) => field.onChange(date?.toISOString())} // Convert selected date to ISO string
                  maxDate={dayjs('2022-04-17')}
                />
              </LocalizationProvider>
            </div>
          </div>
        </div>
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

            <div className="flex justify-end pt-10">
              <Button
                className="w-full px-6 py-7 rounded-full text-md transimtion-all hover:scale-105 bg-[#4338b3] hover:bg-black duration-75 transition-all"
                type="submit"
              >
                Yayyy! Add me{' '}
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
      <div></div>
    </div>
  )
}
