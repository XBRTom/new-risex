/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reduce static generation timeout to avoid hanging
  staticPageGenerationTimeout: 30,
  
  // Add experimental features for better build performance
  experimental: {
    serverComponentsExternalPackages: ['prisma'],
  },
  
  // Optimize webpack for framer-motion
  webpack: (config, { dev, isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  
  // Transpile framer-motion for better compatibility
  transpilePackages: ['framer-motion'],
};

export default nextConfig;
