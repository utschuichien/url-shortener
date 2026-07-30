import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Tối ưu dung lượng Build cho Docker
  async rewrites() {
    // Khi chạy trên VPS qua Docker Compose, BACKEND_URL sẽ là http://url-shortener-backend:3001
    // Nếu chạy Local dưới máy bạn, nó sẽ mặc định là http://localhost:3001
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`, // Proxy to Backend
      },
      {
        // Proxy tất cả các request có 1 segment (như /abc12) về backend để xử lý redirect
        // Do NextJS ưu tiên file system trước (như /dashboard, /login) nên rewrite này an toàn.
        source: '/:shortCode',
        destination: `${backendUrl}/:shortCode`, // Proxy short code redirect to Backend
      },
    ];
  },
};

export default nextConfig;
