import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

//Having error when we import auth options in middleware
// import { authOptions } from './lib/nextAuth/auth';

//We can also make full list of session protected and unprotected route seperately like below example:
// const protectedRoutes = ['/dashboard', '/shops', '/dashboard'];

// const authRoutes = [
//   '/signin',
//   '/signup',
//   '/resetpassword',
//   '/forgetpassword',
//   '/activate',
// ];

//Ready made function of middleware in next auth
// export default withAuth(async (req) => {
//   console.log('reqqqqqqqqqqq', req);
//   const token = req?.nextauth?.token;
//   if (!token) {
//     return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
//   }
//   //TODO: return error for the global error handler of rtk query interceptor.
// });

export const middleware = async (req) => {
  const token =
    (await getToken({ req, secret: process.env.NEXTAUTH_SECRET })) ||
    req?.cookies?.get('accessToken')?.value;
  //If no token it will give us null
  if (!token) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
  }
  // it will automatically start next code without next function
};

export const config = {
  matcher: [
    '/((?!api|register|login|members|_next/static|_next/image|favicon.ico).*)',
  ],
};
