const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  images: {
    domains: [
      'localhost',
      'new-smartbookshelf-vnbmdiupba-uc.a.run.app',
      'shelf-value-hd3z9i1jo-robert-s-projects-5f6e9fbd.vercel.app',
      'shelf-value-io-h5df-grgechind-robert-s-projects-5f6e9fbd.vercel.app'
    ],
  },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NODE_ENV === 'production'
      ? 'https://new-smartbookshelf-vnbmdiupba-uc.a.run.app/'
      : 'http://localhost:8000/',
  },
  async rewrites() {
    return [
      {
        source: '/upload',
        destination: 'http://localhost:8000/upload',
      },
    ];
  },
};
