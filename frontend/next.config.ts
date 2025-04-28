/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "blog-less.onrender.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/api/uploads/**",
      },
      {
        protocol: "https",
        hostname: "blog-less.onrender.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "blog-less.onrender.com",
        pathname: "/api/uploads/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
