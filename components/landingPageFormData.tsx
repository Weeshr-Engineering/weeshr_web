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
import axios from 'axios'

const socialMediaLinks = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/weeshrapp',
    icon:
      'https://res.cloudinary.com/drykej1am/image/upload/v1708288264/weeshr_website/FB_mufgbd.svg'
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/weeshrapp/',
    icon:
      'https://res.cloudinary.com/drykej1am/image/upload/v1708288265/weeshr_website/IG_jw9rir.svg'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/weeshrapp',
    icon:
      'https://res.cloudinary.com/drykej1am/image/upload/v1708288266/weeshr_website/X_vigvoj.svg'
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/weeshrapp',
    icon:
      'https://res.cloudinary.com/drykej1am/image/upload/v1708288750/weeshr_website/Group_80_dhlm3v.svg'
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@weeshrapp',
    icon:
      'https://res.cloudinary.com/drykej1am/image/upload/v1708288501/weeshr_website/TiTokWeeshr_yvqc4r.svg'
  }
]

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
  dob: z.any().optional()
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export const LandingPageFormData = () => {
  const [isDateInput, setIsDateInput] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onChange'
  })

  function onSubmit(data: ProfileFormValues) {
    const requestBody: any = {
      name: data.preferredName,
      email: data.email,
      wish: data.wish || ''
    }

    if (data.dob) {
      console.log('dob changed' + data.dob)

      // Convert the timestamp to a Date object
      const dobDate = new Date(data.dob)

      // Check if the Date object is valid
      if (!isNaN(dobDate.getTime())) {
        // Convert the Date object to string in the desired format
        requestBody.dob = format(dobDate, 'yyyy-mm-dd')
      } else {
        console.error('Invalid date value:', data.dob)
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
        // Handle success
        console.log('Response:', response.data)
        toast.success('Weeshr Form Submitted!')
        form.reset({
          preferredName: '',
          email: '',
          wish: '',
          dob: ''
        })
      })
      .catch((error) => {
        // Handle error
        console.error('Error:', error)
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Data:', error.response.data)
          console.error('Status:', error.response.status)
          console.error('Headers:', error.response.headers)
          toast.error(error.response.data.message || 'An error occurred.')
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Request:', error.request)
          toast.error('Submission unsuccessful. No response received.')
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error:', error.message)
          toast.error('Submission unsuccessful. An error occurred.')
        }
      })
  }

  const commonStyles = {
    bgcolor: '#c3c7db32',

    border: 0,
    width: '100%'
  }

  return (
    <div className="z-50 flex flex-col items-center justify-center w-full pt-10 md:flex-row md:pt-0">
      <div className="md:-translate-y-[90px] md:pl-10 ">
        <div className="flex  text-left text-[#020721] flex-col text-4xl leading-[35px]  justify-start items-start  h-full ">
          <h2 className="">Join our waitlist</h2>
          <h2 className="">and make wishes</h2>
          <h2 className="">come alive</h2>
        </div>
        <h4 className="hidden  text-[#474B61] w-full md:flex flex-wrap text-lg pt-10 md:w-[350px]">
          Weeshr is bringing happiness to your in boxes! Join our waitlist to be the first to know
        </h4>
      </div>

      <motion.div
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 100 }}
        className="px-6 md:pt-8 pt-14  w-full max-w-[600px] md:max-w-[500px]"
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
                              {...field}
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
                className="px-6 py-6 rounded-full transimtion-all text-s hover:scale-105 "
                style={{
                  background:
                    'linear-gradient(90deg, #0CC990 0%, #6A70FF 35.94%, #41C7D9 66.15%, #AEE219 100%)'
                }}
                type="submit"
              >
                Join Wishlist
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>

      <div></div>
    </div>
  )
}
