/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_BASE_URL: process.env.NEXT_BASE_URL,
  },
};

module.exports = nextConfig;
