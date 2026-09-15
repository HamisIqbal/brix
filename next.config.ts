import type { NextConfig } from 'next'

/**
 * Deployed on Vercel. Pages are still prerendered at build time; the only
 * server code is the contact form's Route Handler (app/api/contact).
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Served through Vercel Image Optimization. Sizes match the treatment set
    // in the visual design system (T1-T8).
    formats: ['image/webp'],
    deviceSizes: [390, 640, 828, 1080, 1200, 1440, 1920],
    imageSizes: [160, 240, 320, 440, 560],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'gsap'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
}

export default nextConfig
