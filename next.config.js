/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compress: true,
  productionBrowserSourceMaps: false,
  
  // Suppress CSR deopt warnings for interactive dashboard pages
  // These pages intentionally use client-side rendering for rich interactivity
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  
  // Fix for cache handler warnings - disable filesystem cache in development
  experimental: {
    isrMemoryCacheSize: 0, // Disable ISR memory cache
    ...(process.env.NODE_ENV === 'development' && {
      disableOptimizedLoading: true,
    }),
    // Suppress client-side rendering warnings for dashboard pages
    // These are expected for pages with heavy client-side interactivity
    optimizePackageImports: ['antd', 'recharts', '@ant-design/icons'],
  },
  
  // Disable all caching in development to prevent warnings
  ...(process.env.NODE_ENV === 'development' && {
    cacheHandler: false,
    cacheMaxMemorySize: 0,
  }),
  
  // Custom cache configuration
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  
  // Telemetry is configured via env variable NEXT_TELEMETRY_DISABLED=1

  webpack: (config, { dev, isServer }) => {
    // Suppress specific warnings in development
    if (dev) {
      config.infrastructureLogging = {
        level: 'error',
      };
    }
    
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        message: /Critical dependency: the request of a dependency is an expression/i,
        module: /@prisma[\\/]instrumentation|@opentelemetry[\\/]instrumentation/,
      },
      {
        message: /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/i,
        module: /require-in-the-middle/,
      },
    ];
    return config;
  },
};

module.exports = nextConfig; 
