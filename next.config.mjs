/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "console.cloudinary.com",
        pathname: "/**", // Optional, use to match specific paths
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // Optional, use to match specific paths
      },
    ],
  },
};

export default nextConfig;
