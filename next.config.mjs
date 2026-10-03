const NEST_API_URL = process.env.NEST_API_URL ?? 'http://localhost:4000/api';

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@white/ui', '@white/types'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
  // Proxy browser-side /api/* calls (customer auth, favourites, bookings) to the
  // NestJS API so its auth cookies stay same-site — mirrors apps/admin's setup.
  // Server Components fetch the API directly (see src/lib/api.ts), bypassing this.
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${NEST_API_URL}/:path*` }];
  },
};

export default nextConfig;
