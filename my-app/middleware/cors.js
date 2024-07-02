import { NextResponse } from 'next/server';

export function middleware(req) {
  console.log('Incoming request:', req.method, req.url);

  const response = NextResponse.next();
  const allowedOrigins = [
    'http://localhost:3000',
    'https://shelf-value-hd3z9i1jo-robert-s-projects-5f6e9fbd.vercel.app',
    'https://new-smartbookshelf-vnbmdiupba-uc.a.run.app',
    'https://shelf-value-io-h5df-grgechind-robert-s-projects-5f6e9fbd.vercel.app',
    'https://shelf-value-i31lz02s8-robert-s-projects-5f6e9fbd.vercel.app',
    'https://shelf-value-io.vercel.app'
  ];

  const origin = req.headers.get('origin');
  console.log('Origin:', origin);

  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  console.log('Response headers set:', response.headers);

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
