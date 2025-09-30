import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/items',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
