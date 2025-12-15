/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable Strict Mode

  async redirects() {
    return [
      {
        source: "/",
        destination: "/marketplace",
        permanent: true, // 301 redirect (SEO-safe)
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "console.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "freepik.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.freepik.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
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
