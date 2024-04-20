import { jwtVerify } from 'jose';
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
  const token = cookies().get('accessToken');
  if (token?.value) {
    const verifiedUser = await verifyAuth(token?.value);
    if (!verifiedUser?.payload) {
      //jwt error redirect to members login page
      req.cookies.delete('accessToken');
      const response = NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/login`
      );
      response.cookies.delete('accessToken');
      return response;
    }
  } else {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
    }
    const encodedKey = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    try {
      const decoded = await jwtVerify(token?.jwtToken, encodedKey, {});
    } catch (error) {
      //JWT related errors
      const response = NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/login`
      );
      response.cookies.delete('next-auth.session-token');
      return response;
    }
  }
  return NextResponse.next();
};

export const config = {
  matcher: [
    '/((?!api|register|login|members|_next/static|_next/image|favicon.ico).*)',
  ],
};
