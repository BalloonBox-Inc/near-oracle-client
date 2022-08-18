/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_BASE_URL: process.env.NEXT_BASE_URL,
    NFT_STORAGE_KEY: process.env.NFT_STORAGE_KEY,
    CONTRACT_OWNER_PRIVATE_KEY: process.env.CONTRACT_OWNER_PRIVATE_KEY,
    SCORE_CONTRACT_NAME: process.env.SCORE_CONTRACT_NAME,
    NFT_CONTRACT_NAME: process.env.NFT_CONTRACT_NAME,
    ENV_CONFIG: process.env.ENV_CONFIG,
  },
};

module.exports = nextConfig;
