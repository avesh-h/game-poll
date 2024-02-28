import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAuth } from "./lib/jwtVerify";

export const middleware = async (req) => {
  //   const requestUrl = req?.nextUrl?.pathname;
  const headerList = headers();
  const token = headerList.get("authorization");
  if (!token) {
    return NextResponse.json(
      { message: "Authorization failed!" },
      { status: 403 }
    );
  }
  const decoded = await verifyAuth(token);
  if (decoded?.message) {
    return NextResponse.json({ message: decoded.message }, { status: 401 });
  }
  //it will automatically start next code without next function
};

export const config = {
  //For all path that starts with /api
  //   matcher: ["/api/:path*"],

  //Block login and signup route for this middeware
  matcher: ["/((?!api/auth).*)"],
};
