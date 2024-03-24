import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { verifyAuth } from './lib/jwtVerify';

console.log('in middleware');

export const middleware = async (req) => {
  // const headerList = headers();
  // const token = headerList.get('authorization');
  // if (!token) {
  //   return NextResponse.json(
  //     { message: 'Authorization failed!' },
  //     { status: 403 }
  //   );
  // }
  // const decoded = await verifyAuth(token);
  // if (decoded?.message) {
  //   //For Unauthorized error
  //   return NextResponse.json({ message: decoded.message }, { status: 401 });
  // }
  //it will automatically start next code without next function
};

export const config = {
  //For all path that starts with /api
  // matcher: ['/api/:path*'],
  //For all routes that related to auth
  // matcher: ['/((?!api/auth).*)'],
  //Block login and signup route for this middeware
  // matcher: ['/((?!api|register|login|_next/static|_next/image|favicon.ico).*)'],
};
