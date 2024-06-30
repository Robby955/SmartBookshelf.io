import { NextResponse } from 'next/server';

export function middleware(req) {
  console.log('Incoming request:', req.method, req.url);

  const response = NextResponse.next();
  const allowedOrigins = ['http://localhost:3000', 'https://new-smartbookshelf-vnbmdiupba-uc.a.run.app'];

  const origin = req.headers.get('origin');
  console.log('Origin:', origin);

  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else {
    response.headers.set('Access-Control-Allow-Origin', 'https://new-smartbookshelf-vnbmdiupba-uc.a.run.app');
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  console.log('Response headers set:', {
    'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
    'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
    'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
    'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials'),
  });

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
