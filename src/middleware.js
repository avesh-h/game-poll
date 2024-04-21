import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { verifyAuth } from './lib/jwtVerify';

// const authRoutes = [
//   '/signin',
//   '/signup',
//   '/resetpassword',
//   '/forgetpassword',
//   '/activate',
// ];

export const middleware = async (req) => {
  const token =
    (await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })) || cookies().get('accessToken');
  if (!token) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
  }
  try {
    const decoded = await verifyAuth(token?.jwtToken || token?.value);
    if (!decoded?.payload) {
      const response = NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/login`
      );
      if (cookies().has('accessToken')) {
        response.cookies.delete('accessToken');
      } else {
        response.cookies.delete('next-auth.session-token');
      }
      return response;
    }
  } catch (error) {
    //JWT related errors
    const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
    return response;
  }
  return NextResponse.next();
};

export const config = {
  matcher: [
    '/((?!api|register|login|members|_next/static|_next/image|favicon.ico).*)',
  ],
};
