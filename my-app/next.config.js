const { createProxyMiddleware } = require('http-proxy-middleware');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  images: {
    domains: [
      'localhost',
      'new-smartbookshelf-vnbmdiupba-uc.a.run.app',
      'shelf-value-hd3z9i1jo-robert-s-projects-5f6e9fbd.vercel.app',
      'shelf-value-io-h5df-grgechind-robert-s-projects-5f6e9fbd.vercel.app',
      'shelf-value-i31lz02s8-robert-s-projects-5f6e9fbd.vercel.app'
    ],
  },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BACKEND_URL: isProd
      ? 'https://new-smartbookshelf-vnbmdiupba-uc.a.run.app/'
      : 'http://localhost:8000/',
  },
  async rewrites() {
    return [
      {
        source: '/upload/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}upload/:path*`, // Proxy to Backend
      },
    ];
  },
};
