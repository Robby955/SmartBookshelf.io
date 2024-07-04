const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  images: {
    domains: [
      'localhost',
      'https://smartbookshelf-backend-vnbmdiupba-nn.a.run.app',
      'new-smartbookshelf-vnbmdiupba-uc.a.run.app',
      'storage.googleapis.com',
      'SmartBookshelf.io',
    ],
  },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BACKEND_URL: isProd
      ? 'https://smartbookshelf-backend-vnbmdiupba-nn.a.run.app'
      : 'http://localhost:8000/',
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ];
  },
};
