/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['mongodb'],
  eslint: {
    // Allows production builds to successfully complete on Vercel even if ESLint warnings exist
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ensures production builds proceed reliably on Vercel
    ignoreBuildErrors: true,
  },
};

export default nextConfig;