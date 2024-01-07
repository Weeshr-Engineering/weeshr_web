

import Image from "next/image"
 
import { Button } from "@/components/ui/button"

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
    <h3 className="mt-8 text-lg font-normal tracking-tight text-center uppercase scroll-m-20 xl:pt-10">
    Making your wishes more than a thought
      </h3>

      <div className="z-10 flex justify-center item-center">

<div className="flex flex-col items-center justify-center sm:flex-row sm:gap-2">
  

     
<div className="z-10 flex flex-wrap items-center justify-center gap-4 px-4 py-2 translate-y-20 rounded-full sm:py-4"
 style={{
  background:
    'linear-gradient(90deg, rgba(10,231,165,1) 7%, rgba(149,112,255,1) 40%, rgba(0,224,255,1) 69%, rgba(189,255,0,1) 100%)',
}}
>

        <p className=" [&:not(:first-child)]:mt-6 text-white text-lg md:text-xl ">
        
        <span className="hidden sm:block">  We are building you  birthday magic</span>

        <span className="sm:hidden">   Creating magic !!</span>
      
      </p>
     
     
    
    
      { <Button className="w-auto bg-white text-[#020721] hover:bg-slate-50 rounded-full py-4 px-4">
      Get on the waitlist  <Image
    alt="image"
    src="https://res.cloudinary.com/drykej1am/image/upload/v1704626565/weeshr_website/axcqc2ou9crmtvkeom6o.png"
    width= {20}
    height= {40}
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
      className="translate-y-[100px] sm:translate-y-[77px] "
      
    />

</div>
        
      </div>


      <div className=""> 
        
    

      <svg 
     
      xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 1440 320"><path fill="#4537BA" fill-opacity="1"  d="M0,64L21.8,53.3C43.6,43,87,21,131,48C174.5,75,218,149,262,154.7C305.5,160,349,96,393,106.7C436.4,117,480,203,524,234.7C567.3,267,611,245,655,197.3C698.2,149,742,75,785,58.7C829.1,43,873,85,916,112C960,139,1004,149,1047,170.7C1090.9,192,1135,224,1178,202.7C1221.8,181,1265,107,1309,69.3C1352.7,32,1396,32,1418,32L1440,32L1440,320L1418.2,320C1396.4,320,1353,320,1309,320C1265.5,320,1222,320,1178,320C1134.5,320,1091,320,1047,320C1003.6,320,960,320,916,320C872.7,320,829,320,785,320C741.8,320,698,320,655,320C610.9,320,567,320,524,320C480,320,436,320,393,320C349.1,320,305,320,262,320C218.2,320,175,320,131,320C87.3,320,44,320,22,320L0,320Z"></path></svg>
        </div>
    </div>



    <div className="bg-[#4537BA] h-60 -translate-y-1">

    </div>
   


      </div>
  )
}