import type { NextConfig } from 'next'

/**
 * Static export for Hostinger (or any plain web host): `npm run build` writes
 * a complete site to out/ — HTML, JS, CSS, pre-sized WebP images and the PHP
 * contact handler. Upload the CONTENTS of out/ to public_html. No Node server.
 */
const nextConfig: NextConfig = {
  output: 'export',
  // Every route is emitted as <route>/index.html, which Apache/LiteSpeed serve
  // natively for /route/ — no rewrite rules needed for clean URLs.
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // There is no image server on a static host. scripts/optimize-images.mjs
    // pre-renders every width below as WebP after the build, and the custom
    // loader points each srcset entry at its file. Sizes match the treatment
    // set in the visual design system (T1-T8).
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
    deviceSizes: [390, 640, 828, 1080, 1200, 1440, 1920],
    imageSizes: [160, 240, 320, 440, 560],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'gsap'],
  },
}

export default nextConfig
