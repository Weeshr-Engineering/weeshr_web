import Image from 'next/image'
import { motion } from 'framer-motion'

const LandingLayout = ({ children }: { children: React.ReactNode }) => {


 
  
  return (
    <main className="h-full bg-gradient-to-br from-[] from-5% via-white  via-0.11% to-[E4E6F5] to-99.89% overflow-auto overflow-x-hidden">
    
        {children}
 

  
    </main>
  );
};

export default LandingLayout;
