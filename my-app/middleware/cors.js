// middleware/cors.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  console.log('Incoming request:', req.method, req.url);

  const response = NextResponse.next();
  const allowedOrigins = [
    'http://localhost:3000',
    'https://shelf-value-r04uajmx3-robert-s-projects-5f6e9fbd.vercel.app',
    'https://new-smartbookshelf-vnbmdiupba-uc.a.run.app'
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
