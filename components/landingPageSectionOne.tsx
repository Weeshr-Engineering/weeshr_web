'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { LandingPageFormData } from '@/components/landingPageFormData'

export const SectionOneLanding = () => {

  const socialMediaLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/weeshrapp',
      icon: 'https://res.cloudinary.com/drykej1am/image/upload/v1708288264/weeshr_website/FB_mufgbd.svg',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/weeshrapp/',
      icon: 'https://res.cloudinary.com/drykej1am/image/upload/v1708288265/weeshr_website/IG_jw9rir.svg',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/weeshrapp',
      icon: 'https://res.cloudinary.com/drykej1am/image/upload/v1708288266/weeshr_website/X_vigvoj.svg',
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/weeshrapp',
      icon: 'https://res.cloudinary.com/drykej1am/image/upload/v1708288750/weeshr_website/Group_80_dhlm3v.svg',
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@weeshrapp',
      icon: 'https://res.cloudinary.com/drykej1am/image/upload/v1708288501/weeshr_website/TiTokWeeshr_yvqc4r.svg',
    },
  ];

  return (
    <div>
      <div className=" bg-[url('https://res.cloudinary.com/drykej1am/image/upload/v1704589846/weeshr_website/khqkqicfommy9ofmnwkl.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="flex items-center justify-center w-full pt-24 pb-14">
          <Image
            alt="image"
            src="https://res.cloudinary.com/drykej1am/image/upload/v1708293118/weeshr_website/Weeshrhello_1_tbfvi7.svg"
            width={100}
            height={90}
          ></Image>
        </div>
        <div className="flex items-center justify-center w-full py-10 sm:translate-y-[30px] xl:translate-y-[50px] 2xl:translate-y-[70px]">
          <Image
            alt="image"
            src="https://res.cloudinary.com/drykej1am/image/upload/v1704590628/weeshr_website/c9jufgt5n7dm009cehr4.png"
            width={200}
            height={150}
          ></Image>
        </div>

        <div className="">
          <h3 className="px-4 mt-8 text-lg font-normal tracking-tight text-center text-black uppercase scroll-m-20 xl:pt-10">
            Making your wishes more than a thought
          </h3>

          <div className="z-10 flex justify-center item-center">
            <div className="flex flex-col items-center justify-center sm:flex-row sm:gap-2">
              <div
                className="z-10 flex flex-wrap items-center justify-center gap-4 px-2 py-2 translate-y-20 rounded-full sm:px-4 sm:py-4"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(10,231,165,1) 7%, rgba(149,112,255,1) 40%, rgba(0,224,255,1) 69%, rgba(189,255,0,1) 100%)',
                }}
              >
                <p className=" [&:not(:first-child)]:mt-6 text-white text-md pl-4  ">
                  <span className="hidden sm:block">
                    {' '}
                    We are building you birthday magic
                  </span>

                  <span className="sm:hidden"> Creating magic !!</span>
                </p>

                {
                  <Button
                    
                    onClick={() =>
                      scrollTo({ left: 0, top: 2000, behavior: 'smooth' })
                    }
                    className="w-auto bg-white text-[#020721] hover:bg-slate-50 rounded-full py-5 px-4"
                  >
                    Get on the waitlist{' '}
                    <Image
                      alt="image"
                      src="https://res.cloudinary.com/drykej1am/image/upload/v1704626565/weeshr_website/axcqc2ou9crmtvkeom6o.png"
                      width={20}
                      height={50}
                      className="ml-2"
                    ></Image>
                  </Button>
                }
              </div>
              <div className="translate-y-[100px] sm:translate-y-[77px] z-10 md:pl-3">
                <motion.img
                  src="https://res.cloudinary.com/drykej1am/image/upload/v1704631376/weeshr_website/heirzqtff6zevkg4fosi.png"
                  alt="circle img"
                  width={70}
                  height={70}
                  whileInView={{
                    rotate: 360,
                    transition: { duration: 20, loop: Infinity },
                  }}
                />
              </div>
            </div>
          </div>

          <div className="">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#4537BA"
                fill-opacity="1"
                d="M0,64L21.8,53.3C43.6,43,87,21,131,48C174.5,75,218,149,262,154.7C305.5,160,349,96,393,106.7C436.4,117,480,203,524,234.7C567.3,267,611,245,655,197.3C698.2,149,742,75,785,58.7C829.1,43,873,85,916,112C960,139,1004,149,1047,170.7C1090.9,192,1135,224,1178,202.7C1221.8,181,1265,107,1309,69.3C1352.7,32,1396,32,1418,32L1440,32L1440,320L1418.2,320C1396.4,320,1353,320,1309,320C1265.5,320,1222,320,1178,320C1134.5,320,1091,320,1047,320C1003.6,320,960,320,916,320C872.7,320,829,320,785,320C741.8,320,698,320,655,320C610.9,320,567,320,524,320C480,320,436,320,393,320C349.1,320,305,320,262,320C218.2,320,175,320,131,320C87.3,320,44,320,22,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-[#4537BA] w-full -translate-y-1 lg:translate-y-[75px] flex  items-center justify-center flex-col relative pb-[60px] z-50">
        <div className="w-[93%] bg-[#312782] p-6  relative   sm:p-14 lg:p-16 lg:pt-18 mt-[125px] lg:my-0 rounded-2xl sm:w-[80%] sm:max-w-[560px]   lg:max-w-[720px] flex flex-col  lg:flex-row-reverse h-[670px] lg:h-full lg:justify-end mb-5">
          <div className="flex justify-center py-8 lg:py-0 -translate-y-[120px] lg:translate-y-0 lg:absolute  -right-[60px] ">
            <div className="  flex justify-center  w-[290px] lg:w-full relative ">
              <div className=" z-[900] relative bg-gradient-to-b from-[#ECB59D] to-[#BF715D] h-[250px] w-[250px] rounded-xl translate-x-1">
                <Image
                  className="absolute -right-4 -translate-y-9"
                  src={
                    'https://res.cloudinary.com/drykej1am/image/upload/v1705252910/weeshr_website/pvr4bjqv6e5pqujqwe49.png'
                  }
                  alt={'cake'}
                  height={100}
                  width={150}
                />

                <div className="py-2 px-4 -translate-x-6 w-[80%] border-gray-400 absolute bottom-1/4 bg-[#ffffff33] backdrop-blur-xl	  rounded-xl hover:bg-[#ffffff50]">
                  <div className="text-left text-xs  text-[#CCCEFF] ">
                    Gift Category
                  </div>
                  <div>Food, Cake & Pastries</div>
                </div>
              </div>
              <Image
                className="absolute -bottom-10 left-0 lg:-left-[18px]"
                src={
                  'https://res.cloudinary.com/drykej1am/image/upload/v1705252910/weeshr_website/c1omqu2mhzzvuypxi0og.svg'
                }
                alt={'cake'}
                height={100}
                width={150}
              />
            </div>
          </div>
          <div className="  max-w-[600px] -translate-y-[80px] lg:translate-y-0 lg:max-w-[400px]">
            <div className="">
              <h2 className="text-3xl font-thin text-white">
                Putting back the
              </h2>
              <h2 className={'font-thin text-white text-3xl '}>
                <span className="pr-1 font-extrabold">Happy</span>
                in your <span className="font-extrabold">Birthday</span>
              </h2>
            </div>
            <div className="flex flex-row justify-between gap-1 py-8 text-xl md:gap-7">
              <div className="flex flex-col">
                <div className="text-[#BAEF23] flex-grow">Wish</div>
                <div className="h-full text-xs">YOUR DESIRE</div>
              </div>
              <div className="flex flex-col">
                <div className="text-[#7CE7B1] flex-grow">Connect</div>
                <div className="h-full text-xs">WITH FRIENDS</div>
              </div>
              <div className="flex flex-col">
                <div className="text-[#DF84FF] flex-grow">Give</div>
                <div className="h-full text-xs">WITH LOVE</div>
              </div>
              <div className="flex flex-col">
                <div className="text-[#6BB8FF] flex-grow">Collect</div>
                <div className="h-full text-xs">YOUR GIFTS</div>
              </div>
            </div>

            <div className="text-xs xl:text-sm text-[#CCCEFF] w-[95%] lg:w-[80%]">
              Get what you desire, not what is available. We bank your longings
              until they become a reality for you, your friends and family.
            </div>

            <div className="flex gap-5 pb-10 pt-14 lg:pb-0">
              <Button
                onClick={() =>
                  scrollTo({ left: 0, top: 2000, behavior: 'smooth' })
                }
                className="w-auto bg-transparent text-sm   rounded-full py-5 px-5  border-[1px] text-white hover:bg-white hover:text-black  "
              >
                Drop a wish
              </Button>

              <Button
                onClick={() =>
                  scrollTo({ left: 0, top: 2000, behavior: 'smooth' })
                }
                className="w-auto bg-black  rounded-full py-5 px-5 text-sm text-white hover:bg-white hover:text-black border-[1px] border-black"
              >
                Join waitlist
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="-translate-y-1 bg-white border-transparent border-">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#4537BA"
            fill-opacity="1"
            d="M0,320L40,293.3C80,267,160,213,240,181.3C320,149,400,139,480,154.7C560,171,640,213,720,208C800,203,880,149,960,149.3C1040,149,1120,203,1200,224C1280,245,1360,235,1400,229.3L1440,224L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
          ></path>
        </svg>
      </div>

      <div
        className=" w-full -translate-y-1 flex  items-center justify-center flex-col relative pb-[60px] "
        style={{
          background: 'linear-gradient(180deg, #FFF 0.11%, #E4E6F5 99.89%)',
        }}
      >
        <div className="relative flex flex-col items-center pt-5 ">
          {/* <div className="flex flex-row w-full px-4 py-10 sm:px-16 lg:p-16 sm:max-w-[690px] md:max-w-[800px] lg:max-w-[1000px] md:gap-5 -translate-y-[150px] sm:-translate-y-[200px] md:-translate-y-[240px] lg:-translate-y-[300px] relative"> */}
          <div className="flex flex-row w-full px-4 py-10 sm:px-16 lg:p-16 sm:max-w-[690px] md:max-w-[800px] lg:max-w-[1000px] md:gap-5  relative">
            <div className="md:w-[65%]  lg:w-[50%]  relative flex">
              <div className="bg-[#AEE219] w-full rounded-2xl flex flex-row px-6 sm:px-10 pt-10 justify-around md:px-6 z-50">
                <div className="w-[60%]">
                  <div className="text-3xl font-semibold text-black">
                    <h3>Making</h3>
                    <h3>it more than</h3>
                    <h3>just a wish</h3>
                  </div>

                  <h5 className="text-black text-[#02072199] py-6 text-sm max-w-[250px] md:max-w-[180px]">
                    Stop holding a wish sign and start unboxing that special
                    gift, from that special person on your special day.
                  </h5>

                  <Button
                    onClick={() =>
                      scrollTo({ left: 0, top: 2000, behavior: 'smooth' })
                    }
                    className="w-auto bg-black  rounded-full py-5 px-5 text-sm text-white hover:bg-white hover:text-black border-[1px] border-black my-10"
                  >
                    Be the first to know
                  </Button>
                </div>

                <div className="w-[40%] flex   justify-end align-bottom items-end">
                  <Image
                    src={
                      'https://res.cloudinary.com/drykej1am/image/upload/v1705867666/weeshr_website/feyxbd3slxkcfhhenub5.png'
                    }
                    alt={'cake'}
                    height={70}
                    width={200}
                    className="object-contain bg-contain"
                  />
                </div>
              </div>
              <div className="absolute ml-[10px] w-[95%] translate-y-[45px] bottom-0 left-0 right-0 h-16 bg-[#0000ff14] rounded-t-lg blur opacity-100 transition duration-3000 "></div>
            </div>

            <div className="  md:w-[35%] hidden lg:w-[25%] relative md:block">
              <div className="bg-[#2D3193] w-full rounded-2xl md:flex flex-col pl-7  pt-0 justify-between z-50">
                <div className="flex items-end justify-end ">
                  <Image
                    src={
                      'https://res.cloudinary.com/drykej1am/image/upload/v1705867665/weeshr_website/hn2blrz80x7hk7vmwxbn.png'
                    }
                    alt={'cake'}
                    height={70}
                    width={150}
                    className="bg-cover "
                  />
                </div>
                <div className="">
                  <div className="text-3xl font-semibold text-white ">
                    <h3>You&rsquo;re</h3>
                    <h3>Special</h3>
                  </div>

                  <div className="py-6 font-mono text-xl leading-none text-white">
                    <h3 className="font-thin">Let your day</h3>

                    <h3 className="font-thin">be even more</h3>
                  </div>
                </div>
              </div>
              <div className="absolute ml-[0px] w-[99%] translate-y-[45px] bottom-0 left-0 right-0 h-16 bg-[#0000ff14] rounded-t-lg blur opacity-100 transition duration-3000 "></div>
            </div>

            <div className="relative md:w-[40%] lg:w-[25%] hidden  lg:flex ">
              <div className="bg-[#f3f4fb] w-full  rounded-2xl lg:flex flex-col pl-7  pt-0 justify-around z-50">
                <div className="pt-4">
                  <div className="text-2xl font-semibold text-black leading-[1.1]">
                    <h3>Gift that</h3>
                    <h3>melt the heart</h3>
                  </div>
                  <div className="py-6 font-mono text-xl  text-black leading-[1.2]">
                    <h3 className="font-thin">Give what</h3>

                    <h3 className="font-thin">matters</h3>
                  </div>
                </div>

                <div className="flex items-end justify-end ">
                  <Image
                    src={
                      'https://res.cloudinary.com/drykej1am/image/upload/v1705867664/weeshr_website/lvrvetish4qewmtkqzlq.png'
                    }
                    alt={'cake'}
                    height={70}
                    width={240}
                    className="bg-cover "
                  />
                </div>
              </div>
              <div className="absolute ml-[0px] w-[99%] translate-y-[45px] bottom-0 left-0 right-0 h-16 bg-[#0000ff14] rounded-t-lg blur opacity-100 transition duration-3000 "></div>
            </div>
          </div>

          {/* <div className='-translate-y-[100px] md:-translate-y-[200px] lg:-translate-y-[330px] '> */}
          <div className="w-full">
            <LandingPageFormData />
          </div>
        </div>

        <div className="w-full translate-y-[64px]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#4537BA"
              fill-opacity="1"
              d="M0,128L26.7,149.3C53.3,171,107,213,160,245.3C213.3,277,267,299,320,266.7C373.3,235,427,149,480,138.7C533.3,128,587,192,640,181.3C693.3,171,747,85,800,90.7C853.3,96,907,192,960,240C1013.3,288,1067,288,1120,277.3C1173.3,267,1227,245,1280,218.7C1333.3,192,1387,160,1413,144L1440,128L1440,320L1413.3,320C1386.7,320,1333,320,1280,320C1226.7,320,1173,320,1120,320C1066.7,320,1013,320,960,320C906.7,320,853,320,800,320C746.7,320,693,320,640,320C586.7,320,533,320,480,320C426.7,320,373,320,320,320C266.7,320,213,320,160,320C106.7,320,53,320,27,320L0,320Z"
            ></path>
          </svg>
          <div className="bg-[#4537BA] flex flex-row -translate-y-1 justify-between w-full px-6 py-10">
            <div className="md:w-[30%] flex justify-center">
              <Image
                alt="image"
                src="https://res.cloudinary.com/drykej1am/image/upload/v1697377875/weehser%20pay/Weeshr_Light_lrreyo.svg"
                width={100}
                height={90}
              ></Image>
            </div>

            <div className="md:flex md:flex-row-reverse  md:items-center md:w-[70%] md:justify-around">
  

            <ul className="flex space-x-0">
      {socialMediaLinks.map((link) => (
        <li key={link.name}>
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            <Image
            height={43}
            width={43}
              src={link.icon}
              alt={link.name}
              className="inline-block transition-opacity duration-300 hover:opacity-80 md:w-12"
            />
          </a>
        </li>
      ))}
    </ul>
       



              <h4 className="text-xs text-center md:text-sm ">@2024 Weeshr.ALL right reserved</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
