import Image from "next/image"

import {Button} from "@/components/ui/button"

export const SectionOneLanding = () => {

  return (
    <div
    className=" bg-[url('https://res.cloudinary.com/drykej1am/image/upload/v1704589846/weeshr_website/khqkqicfommy9ofmnwkl.jpg')] bg-cover bg-center bg-no-repeat">
    <div className="flex items-center justify-center w-full pt-24 pb-14">
    <Image
    alt="image"
    src="https://res.cloudinary.com/drykej1am/image/upload/v1704589088/weeshr_website/slwxzgvebzv5xipwv4oi.png"
    width= {100}
    height= {90}
    >

    </Image>
    </div>
    <div className="flex items-center justify-center w-full py-10 sm:translate-y-[30px] xl:translate-y-[50px] 2xl:translate-y-[70px]">
    <Image
    alt="image"
    src="https://res.cloudinary.com/drykej1am/image/upload/v1704590628/weeshr_website/c9jufgt5n7dm009cehr4.png"
    width= {200}
    height= {150}
    >

    </Image>
    </div>

    <div className="">
        <h3 className="mt-8 text-lg font-normal tracking-tight text-center uppercase scroll-m-20 xl:pt-10 text-black">
    Making your wishes more than a thought
      </h3>

      <div className="z-10 flex justify-center item-center">

<div className="flex flex-col items-center justify-center sm:flex-row sm:gap-2">



<div className="z-10 flex flex-wrap items-center justify-center gap-4 px-6 py-2 translate-y-20 rounded-full sm:py-4"
 style={{
  background:
    'linear-gradient(90deg, rgba(10,231,165,1) 7%, rgba(149,112,255,1) 40%, rgba(0,224,255,1) 69%, rgba(189,255,0,1) 100%)',
}}
>

        <p className=" [&:not(:first-child)]:mt-6 text-white text-md pl-4  ">

        <span className="hidden sm:block">  We are building you  birthday magic</span>

        <span className="sm:hidden">   Creating magic !!</span>

      </p>


    {<Button className="w-auto bg-white text-[#020721] hover:bg-slate-50 rounded-full py-5 px-4">
      Get on the waitlist  <Image
    alt="image"
    src="https://res.cloudinary.com/drykej1am/image/upload/v1704626565/weeshr_website/axcqc2ou9crmtvkeom6o.png"
    width= {20}
    height={50}
    className="ml-2"
    >

    </Image>
    </Button> }

    </div >





    <Image
      src="https://res.cloudinary.com/drykej1am/image/upload/v1704631376/weeshr_website/heirzqtff6zevkg4fosi.png"
      alt="circle img"
      width={70}
      height={70}
      className="translate-y-[100px] sm:translate-y-[77px] z-10 "

    />

</div>

      </div>


      <div className="">



      <svg

      xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 1440 320"><path fill="#4537BA" fill-opacity="1"  d="M0,64L21.8,53.3C43.6,43,87,21,131,48C174.5,75,218,149,262,154.7C305.5,160,349,96,393,106.7C436.4,117,480,203,524,234.7C567.3,267,611,245,655,197.3C698.2,149,742,75,785,58.7C829.1,43,873,85,916,112C960,139,1004,149,1047,170.7C1090.9,192,1135,224,1178,202.7C1221.8,181,1265,107,1309,69.3C1352.7,32,1396,32,1418,32L1440,32L1440,320L1418.2,320C1396.4,320,1353,320,1309,320C1265.5,320,1222,320,1178,320C1134.5,320,1091,320,1047,320C1003.6,320,960,320,916,320C872.7,320,829,320,785,320C741.8,320,698,320,655,320C610.9,320,567,320,524,320C480,320,436,320,393,320C349.1,320,305,320,262,320C218.2,320,175,320,131,320C87.3,320,44,320,22,320L0,320Z"></path></svg>
        </div>
    </div>


        <div className="bg-[#4537BA] w-full -translate-y-1 flex  items-center justify-center">

            <div
                className="w-[93%] bg-[#312782] p-6  relative   sm:p-14 lg:p-16 lg:pt-18 my-[125px] lg:my-0 rounded-2xl sm:w-[80%] sm:max-w-[560px]   lg:max-w-[720px] flex flex-col  lg:flex-row-reverse h-[670px] lg:h-full lg:justify-end">
                <div className="flex justify-center py-8 lg:py-0 -translate-y-[120px] lg:translate-y-0 lg:absolute  -right-[60px] ">
                    <div className="  flex justify-center  w-[290px] lg:w-full relative ">

                        <div
                            className=" z-[900] relative bg-gradient-to-b from-[#ECB59D] to-[#BF715D] h-[250px] w-[250px] rounded-xl translate-x-1">
                            <Image className="absolute -right-4 -translate-y-9"
                                   src={"https://res.cloudinary.com/drykej1am/image/upload/v1705252910/weeshr_website/pvr4bjqv6e5pqujqwe49.png"}
                                   alt={"cake"} height={100} width={150}/>

                            <div
                                className="py-2 px-4 -translate-x-6 w-[80%] border-gray-400 absolute bottom-1/4 bg-[#ffffff33] backdrop-blur-xl	  rounded-xl">
                                <div className="text-left text-xs  text-[#CCCEFF] ">
                                    Gift Category
                                </div>
                                <div>
                                    Food, Cake & Pastries
                                </div>
                            </div>


                        </div>
                        <Image className="absolute -bottom-10 left-0 lg:-left-[18px]"
                               src={"https://res.cloudinary.com/drykej1am/image/upload/v1705252910/weeshr_website/c1omqu2mhzzvuypxi0og.svg"}
                               alt={"cake"} height={100} width={150}/>

                    </div>


                </div>
                <div className="  max-w-[600px] -translate-y-[80px] lg:translate-y-0 lg:max-w-[400px]">
                    <div className=" ">
                        <h2 className="font-thin text-white text-3xl font-thin">
                            Putting back the

                        </h2>
                        <h2 className={"font-thin text-white text-3xl font-thin"}>
                    <span className="font-extrabold pr-1">
                        Happy
                    </span>
                            in your <span className="font-extrabold">
                    Birthday
                </span>



                        </h2>

                    </div>
                    <div className="flex flex-row justify-between text-xl py-8 gap-1 md:gap-7">
                        <div className="flex flex-col">
                            <div className="text-[#BAEF23] flex-grow">
                                Wish
                            </div>
                            <div className="text-xs  h-full">
                                YOUR DESIRE
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-[#7CE7B1] flex-grow">
                                Connect
                            </div>
                            <div className="text-xs  h-full">
                                WITH FRIENDS
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-[#DF84FF] flex-grow">
                                Give
                            </div>
                            <div className="text-xs  h-full">
                                WITH LOVE
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-[#6BB8FF] flex-grow">
                                Collect
                            </div>
                            <div className="text-xs  h-full">
                                YOUR GIFTS
                            </div>
                        </div>


                    </div>

                    <div className="text-xs xl:text-sm text-[#CCCEFF] w-[95%] lg:w-[80%]">
                        Get what you desire, not what is available. We bank your longings until they become a reality
                        for you, your friends and family.
                    </div>

                    <div className="flex  gap-5 pt-14 pb-10 lg:pb-0">


                        <Button className="w-auto bg-transparent text-sm   rounded-full py-5 px-5  border-[1px] text-white hover:bg-white hover:text-black  ">
                            Drop a wish
                        </Button>

                        <Button className="w-auto bg-black hover:bg-slate-50 rounded-full py-5 px-5 text-sm text-white hover:bg-white hover:text-black border-[1px] border-black">
                           Join waitlist
                        </Button>


                    </div>


                </div>


            </div>


        </div>


        <div className="-translate-y-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#4537BA" fill-opacity="1"
                      d="M0,320L40,293.3C80,267,160,213,240,181.3C320,149,400,139,480,154.7C560,171,640,213,720,208C800,203,880,149,960,149.3C1040,149,1120,203,1200,224C1280,245,1360,235,1400,229.3L1440,224L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"></path>
            </svg>
        </div>

    </div>
  )
}