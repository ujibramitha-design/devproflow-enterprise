const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['localhost', 'images.unsplash.com', 'devproflow.com', 'www.devproflow.com'],
  },

  // Allow Next.js compiler to process files from 05_UI_Design_System outside project root
  experimental: {
    outputFileTracingRoot: path.resolve(__dirname, '../../'),
  },

  webpack: (config) => {
    // Resolve @/ds-components/* and @/ds-lib/* to 05_UI_Design_System
    config.resolve.alias['@/ds-components'] = path.resolve(
      __dirname, '../../05_UI_Design_System/Implementation/Web/components'
    )
    config.resolve.alias['@/ds-lib'] = path.resolve(
      __dirname, '../../05_UI_Design_System/Implementation/Web/lib'
    )
    return config
  },
}

module.exports = nextConfig
