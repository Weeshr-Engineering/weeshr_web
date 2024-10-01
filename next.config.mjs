/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable Strict Mode
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "console.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
