import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Local, statically-imported assets only. Sizes match the treatment set
    // in the visual design system (T1-T8) so no oversized variant is generated.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 828, 1080, 1200, 1440, 1920],
    imageSizes: [160, 240, 320, 440, 560],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'gsap'],
  },
  async headers() {
    return [
      {
        source: '/media/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

export default nextConfig
