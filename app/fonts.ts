// app/fonts.ts
import localFont from "next/font/local";

// Path should include the Playwrite_CU folder
export const playwrite = localFont({
  src: "./fonts/Playwrite_CU/PlaywriteCU-VariableFont_wght.ttf",
  variable: "--font-playwrite",
  display: "swap",
});
