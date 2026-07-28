import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*', // Proxy to Backend
      },
      {
        // Proxy tất cả các request có 1 segment (như /abc12) về backend để xử lý redirect
        // Do NextJS ưu tiên file system trước (như /dashboard, /login) nên rewrite này an toàn.
        source: '/:shortCode',
        destination: 'http://localhost:3001/:shortCode', // Proxy short code redirect to Backend
      },
    ];
  },
};

export default nextConfig;
