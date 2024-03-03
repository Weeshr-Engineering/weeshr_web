import type { Metadata } from 'next'
import { Outfit } from 'next/font/google' // Assuming there's a font called Outfit
import './globals.css'
import toast, { Toaster } from 'react-hot-toast';

const outfit = Outfit({ subsets: ['latin'] })


export const metadata: Metadata = {


  title: "Weeshr",
  description: "Make a Weesh!! ",

  openGraph: {
    title: "Weeshr",
    description: "Make a Weesh!!",
    url: 'https://weeshr.com',
    images: [
      {
        url: 'https://res.cloudinary.com/drykej1am/image/upload/v1704585596/weeshr_website/scybremtt3coh9qnsj3v.png',
        width: 800,
        height: 600,
      },
      {
        url: 'https://res.cloudinary.com/drykej1am/image/upload/v1704585596/weeshr_website/scybremtt3coh9qnsj3v.png',
        width: 1800,
        height: 1600,
        alt: 'Weeshr alt',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    title: 'Weeshr',
    description: 'Make a Weesh',
    images: ['https://res.cloudinary.com/drykej1am/image/upload/v1704585596/weeshr_website/scybremtt3coh9qnsj3v.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>{children}</body>
      <Toaster 
       position="bottom-right"
       reverseOrder={false}
      />
      
    </html>
  )
}
