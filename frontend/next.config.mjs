/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "iili.io",
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
