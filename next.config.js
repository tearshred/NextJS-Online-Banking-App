/** @type {import('next').NextConfig} */
const nextConfig = {
    productionBrowserSourceMaps: false,
    experimental: {
        optimizeFonts: true,
      },
      webpack: (config) => {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
        };
        return config;
      },
}

module.exports = nextConfig
