import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '3.75.225.78',
        port: '8080',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
