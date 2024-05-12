import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { connectToDB } from '@/lib/dbHandler';
import { User } from '@/lib/models/userSchema';

export const POST = async (req) => {
  const { accessToken } = await req.json();
  const refreshToken = cookies().get('refresh_token');
  try {
    await connectToDB();
    if (accessToken) {
      const decoded = jwt.verify(
        refreshToken.value,
        process.env.REFRESH_TOKEN_SECRET
      );
      if (decoded?.email) {
        const existUser = await User.findOne({ email: decoded.email });
        if (!existUser) {
          return NextResponse(
            { error: 'Authentication Error!', status: 'failed' },
            { status: 403 }
          );
        }
        // TODO:check current reques user Id is same as the exist user Id then generate the tokens
        const userData = {
          email: existUser?.email,
          userId: existUser?._id,
        };
        const newAccessToken = jwt.sign(
          userData,
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: '1m',
          }
        );
        const newRefreshToken = jwt.sign(
          userData,
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: '24h' }
        );
        const response = NextResponse.json(
          { accessToken: newAccessToken },
          { status: 200 }
        );
        response.cookies.set('refresh_token', newRefreshToken);
        return response;
      }
    }
  } catch (error) {
    return NextResponse.json({ error, status: 'failed' }, { status: 401 });
  }
};
