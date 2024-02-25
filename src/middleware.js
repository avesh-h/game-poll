import { NextResponse } from "next/server";

export const middleware = (req) => {
  const requestUrl = req?.nextUrl?.pathname;
};

export const config = {
  //For all path that starts with /api
  //   matcher: ["/api/:path*"],

  //Block login and signup route for this middeware
  matcher: ["/((?!api/auth).*)"],
};
