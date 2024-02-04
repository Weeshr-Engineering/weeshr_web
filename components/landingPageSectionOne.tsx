"use client"

import { motion } from "framer-motion";
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { LandingPageFormData } from '@/components/landingPageFormData'



export const SectionOneLanding = () => {
  return (
    <div>
      <div className=" bg-[url('https://res.cloudinary.com/drykej1am/image/upload/v1704589846/weeshr_website/khqkqicfommy9ofmnwkl.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="flex items-center justify-center w-full pt-24 pb-14">
          <Image
            alt="image"
            src="https://res.cloudinary.com/drykej1am/image/upload/v1704589088/weeshr_website/slwxzgvebzv5xipwv4oi.png"
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
          <h3 className="mt-8 text-lg font-normal tracking-tight text-center text-black uppercase scroll-m-20 xl:pt-10">
            Making your wishes more than a thought
          </h3>

          <div className="z-10 flex justify-center item-center">
            <div className="flex flex-col items-center justify-center sm:flex-row sm:gap-2">
              <div
                className="z-10 flex flex-wrap items-center justify-center gap-4 px-6 py-2 translate-y-20 rounded-full sm:py-4"
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
                  onClick={() => scrollTo({ left: 0, top: 2000, behavior: "smooth" })}
                  className="w-auto bg-white text-[#020721] hover:bg-slate-50 rounded-full py-5 px-4">
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
<div   className="translate-y-[100px] sm:translate-y-[77px] z-10 md:pl-3">
  

<motion.img
  src="https://res.cloudinary.com/drykej1am/image/upload/v1704631376/weeshr_website/heirzqtff6zevkg4fosi.png"
  alt="circle img"
  width={70}
  height={70}

  whileInView={{ rotate: 360, transition: { duration: 20, loop: Infinity } }}

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

      <div className="bg-[#4537BA] w-full -translate-y-1 lg:translate-y-[75px] flex  items-center justify-center flex-col relative pb-[60px]">
        <div className="w-[93%] bg-[#312782] p-6  relative   sm:p-14 lg:p-16 lg:pt-18 mt-[125px] lg:my-0 rounded-2xl sm:w-[80%] sm:max-w-[560px]   lg:max-w-[720px] flex flex-col  lg:flex-row-reverse h-[670px] lg:h-full lg:justify-end">
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

                <div className="py-2 px-4 -translate-x-6 w-[80%] border-gray-400 absolute bottom-1/4 bg-[#ffffff33] backdrop-blur-xl	  rounded-xl">
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
              onClick={() => scrollTo({ left: 0, top: 2000, behavior: "smooth" })}
              className="w-auto bg-transparent text-sm   rounded-full py-5 px-5  border-[1px] text-white hover:bg-white hover:text-black  ">
                Drop a wish
              </Button>

              <Button
              onClick={() => scrollTo({ left: 0, top: 2000, behavior: "smooth" })}
              className="w-auto bg-black  rounded-full py-5 px-5 text-sm text-white hover:bg-white hover:text-black border-[1px] border-black">
                Join waitlist
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="-translate-y-1 bg-white lg:translate-y-[50px]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#4537BA"
            fill-opacity="1"
            d="M0,320L40,293.3C80,267,160,213,240,181.3C320,149,400,139,480,154.7C560,171,640,213,720,208C800,203,880,149,960,149.3C1040,149,1120,203,1200,224C1280,245,1360,235,1400,229.3L1440,224L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
          ></path>
        </svg>
      </div>

      <div className=" w-full -translate-y-1 flex  items-center justify-center flex-col relative pb-[60px] "
       style={{
        background:
          'linear-gradient(180deg, #FFF 0.11%, #E4E6F5 99.89%)',
      }}
      >
        <div className='relative flex flex-col items-center pt-5 '>
            
      
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
                  Stop holding a wish sign and start unboxing that special gift,
                  from that special person on your special day.
                </h5>

                <Button 
                onClick={() => scrollTo({ left: 0, top: 2000, behavior: "smooth" })}
                className="w-auto bg-black  rounded-full py-5 px-5 text-sm text-white hover:bg-white hover:text-black border-[1px] border-black my-10">
                  Be the first to know
                </Button>
              </div>

              <div className="w-[40%] flex  justify-center items-end">
                <Image
                  src={
                    'https://res.cloudinary.com/drykej1am/image/upload/v1705867666/weeshr_website/feyxbd3slxkcfhhenub5.png'
                  }
                  alt={'cake'}
                  height={70}
                  width={200}
                  className="bg-cover h-[89%]"
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
            <div className=''>
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
          <div className='bg-[#4537BA] flex flex-row -translate-y-1 justify-between w-full px-6 py-10'>
<div
          className="md:w-[30%] flex justify-center"

>
  

          <Image
            alt="image"
            src="https://res.cloudinary.com/drykej1am/image/upload/v1697377875/weehser%20pay/Weeshr_Light_lrreyo.svg"
            width={100}
            height={90}
          ></Image>
          </div>

          <div  className='md:flex md:flex-row-reverse  md:items-center md:w-[70%] md:justify-around'>
         

            <div className=''>

            <svg xmlns="http://www.w3.org/2000/svg" className='cursor-grab' width="150" height="85" viewBox="0 0 211 85" fill="none">
  <g filter="url(#filter0_dd_3905_4702)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M35.899 67.2613C49.7024 67.2613 60.8923 56.0715 60.8923 42.2681C60.8923 28.4647 49.7024 17.2749 35.899 17.2749C22.0957 17.2749 10.9058 28.4647 10.9058 42.2681C10.9058 56.0715 22.0957 67.2613 35.899 67.2613Z" fill="white"/>
    <path d="M59.3927 42.2681C59.3927 55.2433 48.8742 65.7617 35.899 65.7617C22.9239 65.7617 12.4054 55.2433 12.4054 42.2681C12.4054 29.293 22.9239 18.7745 35.899 18.7745C48.8742 18.7745 59.3927 29.293 59.3927 42.2681Z" stroke="white" stroke-width="2.99919"/>
  </g>
  <path d="M34.5985 49.6591L34.5781 43.3639H31.9002V40.6659H34.5781V38.8673C34.5781 36.4399 36.0701 35.27 38.2194 35.27C39.2489 35.27 40.1337 35.3472 40.3916 35.3818V37.9186L38.9009 37.9193C37.732 37.9193 37.5057 38.4789 37.5057 39.3001V40.6659H40.8264L39.9337 43.3639H37.5057V49.6591H34.5985Z" fill="#0A142F"/>
  <g filter="url(#filter1_dd_3905_4702)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M175.861 67.2613C189.664 67.2613 200.854 56.0715 200.854 42.2681C200.854 28.4647 189.664 17.2749 175.861 17.2749C162.058 17.2749 150.868 28.4647 150.868 42.2681C150.868 56.0715 162.058 67.2613 175.861 67.2613Z" fill="white"/>
    <path d="M199.355 42.2681C199.355 55.2433 188.836 65.7617 175.861 65.7617C162.886 65.7617 152.367 55.2433 152.367 42.2681C152.367 29.293 162.886 18.7745 175.861 18.7745C188.836 18.7745 199.355 29.293 199.355 42.2681Z" stroke="white" stroke-width="2.99919"/>
  </g>
  <path d="M183.145 37.6185C182.609 37.8883 182.074 37.9782 181.449 38.0682C182.074 37.7084 182.52 37.1689 182.698 36.4494C182.163 36.8091 181.538 36.989 180.824 37.1689C180.288 36.6293 179.485 36.2695 178.682 36.2695C177.164 36.2695 175.825 37.6185 175.825 39.2373C175.825 39.5071 175.825 39.6869 175.915 39.8668C173.504 39.7769 171.273 38.6078 169.845 36.8091C169.577 37.2588 169.488 37.7084 169.488 38.338C169.488 39.3272 170.023 40.2265 170.827 40.7661C170.38 40.7661 169.934 40.5863 169.488 40.4064C169.488 41.8453 170.47 43.0144 171.808 43.2842C171.541 43.3742 171.273 43.3742 171.005 43.3742C170.827 43.3742 170.648 43.3742 170.47 43.2842C170.827 44.4533 171.898 45.3527 173.237 45.3527C172.255 46.162 171.005 46.6117 169.577 46.6117C169.309 46.6117 169.131 46.6117 168.863 46.6117C170.202 47.4211 171.719 47.9607 173.326 47.9607C178.682 47.9607 181.627 43.4641 181.627 39.597C181.627 39.5071 181.627 39.3272 181.627 39.2373C182.252 38.7876 182.788 38.248 183.145 37.6185Z" fill="#0A142F"/>
  <g filter="url(#filter2_dd_3905_4702)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M105.88 67.2613C119.683 67.2613 130.873 56.0715 130.873 42.2681C130.873 28.4647 119.683 17.2749 105.88 17.2749C92.0766 17.2749 80.8868 28.4647 80.8868 42.2681C80.8868 56.0715 92.0766 67.2613 105.88 67.2613Z" fill="white"/>
    <path d="M129.374 42.2681C129.374 55.2433 118.855 65.7617 105.88 65.7617C92.9048 65.7617 82.3864 55.2433 82.3864 42.2681C82.3864 29.293 92.9048 18.7745 105.88 18.7745C118.855 18.7745 129.374 29.293 129.374 42.2681Z" stroke="white" stroke-width="2.99919"/>
  </g>
  <path d="M109.747 40.2109C110.178 40.2109 110.527 39.8618 110.527 39.4312C110.527 39.0005 110.178 38.6514 109.747 38.6514C109.316 38.6514 108.967 39.0005 108.967 39.4312C108.967 39.8618 109.316 40.2109 109.747 40.2109Z" fill="#0A142F"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M103.131 42.7677C103.131 44.5596 104.588 46.0168 106.38 46.0168C108.172 46.0168 109.629 44.5596 109.629 42.7677C109.629 40.9758 108.172 39.5186 106.38 39.5186C104.588 39.5186 103.131 40.9758 103.131 42.7677ZM104.755 42.7677C104.755 41.8718 105.484 41.1431 106.38 41.1431C107.276 41.1431 108.004 41.8718 108.004 42.7677C108.004 43.6636 107.276 44.3923 106.38 44.3923C105.484 44.3923 104.755 43.6636 104.755 42.7677Z" fill="#0A142F"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M103.131 49.266H109.629C111.299 49.266 112.878 47.6869 112.878 46.0169V39.5186C112.878 37.8486 111.299 36.2695 109.629 36.2695H103.131C101.461 36.2695 99.8816 37.8486 99.8816 39.5186V46.0169C99.8816 47.6869 101.461 49.266 103.131 49.266ZM101.506 39.5187C101.506 38.7592 102.371 37.8941 103.131 37.8941H109.629C110.389 37.8941 111.254 38.7592 111.254 39.5187V46.0169C111.254 46.7764 110.389 47.6415 109.629 47.6415H103.131C102.357 47.6415 101.506 46.791 101.506 46.0169V39.5187Z" fill="#0A142F"/>
  <defs>
    <filter id="filter0_dd_3905_4702" x="0.908536" y="0.279515" width="69.981" height="83.9771" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="6.9981"/>
      <feGaussianBlur stdDeviation="4.99864"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.294118 0 0 0 0 0.294118 0 0 0 0 0.294118 0 0 0 0.1 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3905_4702"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="-6.9981"/>
      <feGaussianBlur stdDeviation="4.99864"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.294118 0 0 0 0 0.294118 0 0 0 0 0.294118 0 0 0 0.01 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_3905_4702" result="effect2_dropShadow_3905_4702"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_3905_4702" result="shape"/>
    </filter>
    <filter id="filter1_dd_3905_4702" x="140.871" y="0.279515" width="69.981" height="83.9771" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="6.9981"/>
      <feGaussianBlur stdDeviation="4.99864"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.294118 0 0 0 0 0.294118 0 0 0 0 0.294118 0 0 0 0.1 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3905_4702"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="-6.9981"/>
      <feGaussianBlur stdDeviation="4.99864"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.294118 0 0 0 0 0.294118 0 0 0 0 0.294118 0 0 0 0.01 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_3905_4702" result="effect2_dropShadow_3905_4702"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_3905_4702" result="shape"/>
    </filter>
    <filter id="filter2_dd_3905_4702" x="70.8895" y="0.279515" width="69.981" height="83.9771" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="6.9981"/>
      <feGaussianBlur stdDeviation="4.99864"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.294118 0 0 0 0 0.294118 0 0 0 0 0.294118 0 0 0 0.1 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3905_4702"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="-6.9981"/>
      <feGaussianBlur stdDeviation="4.99864"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.294118 0 0 0 0 0.294118 0 0 0 0 0.294118 0 0 0 0.01 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_3905_4702" result="effect2_dropShadow_3905_4702"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_3905_4702" result="shape"/>
    </filter>
  </defs>
</svg>

            </div>
            <h4 className='text-xs'>
              @2024 Weeshr.ALL right reserved 
            </h4>
          </div>
            
          </div>
        </div>
      </div>
    
    </div>
  )
}
