/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/evento',
        destination: '/eventos',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
// next.config.js
module.exports = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, // ← importante para builds no Vercel
    };
    return config;
  },
};
