const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://sismoc-production-8jaa.vercel.app'
  },
  trailingSlash: true,
  distDir: '.next'
};

export default nextConfig;