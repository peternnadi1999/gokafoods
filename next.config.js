/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
        expiration: { maxEntries: 4, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-images',
        expiration: { maxEntries: 64, maxAgeSeconds: 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: { maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'others',
        expiration: { maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 },
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // headers: async () => [
  //   {
      // source: '/(.*)',
      // headers: [
      //   { key: 'X-Content-Type-Options', value: 'nosniff' },
      //   { key: 'X-Frame-Options', value: 'DENY' },
      //   { key: 'X-XSS-Protection', value: '1; mode=block' },
      //   { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      //   {
      //     key: 'Permissions-Policy',
      //     value: 'camera=(), microphone=(), geolocation=(self)',
      //   },
        // {
        //   key: 'Content-Security-Policy',
        //   value: [
        //     "default-src 'self'",
        //     "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
        //     "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        //     "font-src 'self' https://fonts.gstatic.com",
        //     "img-src 'self' data: https:",
        //     "connect-src 'self' https:",
        //   ].join('; '),
        // },
      // ],
  //   },
  // ],
};

module.exports = withPWA(nextConfig);
