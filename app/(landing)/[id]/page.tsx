'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { MonthsPageFormData } from '@/components/MonthsPageFormData'
import { useRouter } from 'next/navigation'

const MonthsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const id = params.id

  const socialMediaLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/weeshrapp',
      icon:
        'https://res.cloudinary.com/drykej1am/image/upload/v1708288264/weeshr_website/FB_mufgbd.svg',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/weeshrapp/',
      icon:
        'https://res.cloudinary.com/drykej1am/image/upload/v1708288265/weeshr_website/IG_jw9rir.svg',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/weeshrapp',
      icon:
        'https://res.cloudinary.com/drykej1am/image/upload/v1708288266/weeshr_website/X_vigvoj.svg',
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/weeshrapp',
      icon:
        'https://res.cloudinary.com/drykej1am/image/upload/v1708288750/weeshr_website/Group_80_dhlm3v.svg',
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@weeshrapp',
      icon:
        'https://res.cloudinary.com/drykej1am/image/upload/v1708288501/weeshr_website/TiTokWeeshr_yvqc4r.svg',
    },
  ]

  // Validate id
  const isValidId = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ].includes(id)

  if (!isValidId) {
    
    return router.push('/505/err')
  
  }

  return (
    <div className="h-full">
      <div>
        <div className=" bg-[url('https://res.cloudinary.com/drykej1am/image/upload/v1704589846/weeshr_website/khqkqicfommy9ofmnwkl.jpg')] bg-cover bg-center bg-no-repeat">
          <div className=" w-full -translate-y-1 flex  items-center justify-center flex-col relative pb-[60px] ">
            <div className="relative flex flex-col items-center w-full pt-5">
              <MonthsPageFormData month={id} />
            </div>

            <div className="w-full translate-y-[64px]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path
                  fill="#4537BA"
                  fill-opacity="1"
                  d="M0,128L26.7,149.3C53.3,171,107,213,160,245.3C213.3,277,267,299,320,266.7C373.3,235,427,149,480,138.7C533.3,128,587,192,640,181.3C693.3,171,747,85,800,90.7C853.3,96,907,192,960,240C1013.3,288,1067,288,1120,277.3C1173.3,267,1227,245,1280,218.7C1333.3,192,1387,160,1413,144L1440,128L1440,320L1413.3,320C1386.7,320,1333,320,1280,320C1226.7,320,1173,320,1120,320C1066.7,320,1013,320,960,320C906.7,320,853,320,800,320C746.7,320,693,320,640,320C586.7,320,533,320,480,320C426.7,320,373,320,320,320C266.7,320,213,320,160,320C106.7,320,53,320,27,320L0,320Z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MonthsPage
