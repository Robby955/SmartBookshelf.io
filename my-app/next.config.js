const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  images: {
    domains: [
      'localhost',
      'new-smartbookshelf-vnbmdiupba-uc.a.run.app',
      'shelf-value-hd3z9i1jo-robert-s-projects-5f6e9fbd.vercel.app',
      'shelf-value-io-h5df-b09c5d3mv-robert-s-projects-5f6e9fbd.vercel.app',
      'storage.googleapis.com'
    ],
  },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BACKEND_URL: isProd
      ? 'https://new-smartbookshelf-vnbmdiupba-uc.a.run.app/'
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
