/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://api:8080/api/v1/:path*'
      }
    ]
  }
};

export default nextConfig;
