
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "**", // for allowing all domains, you can specify specific domains instead of using "**"
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;