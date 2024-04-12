import gameDao from '@/lib/daos/gameDao';
import memberDao from '@/lib/daos/memberDao';
import { connectToDB } from '@/lib/dbHandler';
import { httpStatusCode } from '@/lib/httpStatusCode';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  const memberData = await req.json();
  try {
    await connectToDB();
    const game = await gameDao.getSingleGame(memberData?.gameId);
    if (memberData?.email) {
      const isSameMemberExist = game?.members?.find(
        (member) => member?.email === memberData?.email
      );

      if (isSameMemberExist) {
        return NextResponse.json(
          { error: 'Same email already exist!', status: 'failed' },
          { status: httpStatusCode.BAD_REQUEST }
        );
      }
    }
    if (memberData?.gamePassword !== game?.gamePassword) {
      return NextResponse.json(
        {
          error: 'Invalid Password!',
          status: 'failed',
        },
        { status: httpStatusCode.FORBIDDEN }
      );
    }
    const createMember = await memberDao.createMember(memberData);
    const userData = {
      id: createMember?._id,
      email: createMember?.email,
    };
    const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    });

    const response = NextResponse.json(
      { member: createMember, status: 'success' },
      { status: httpStatusCode.CREATED }
    );
    response.cookies.set('accessToken', accessToken);
    return response;
  } catch (error) {
    return NextResponse.json({ error }, { status: httpStatusCode.FORBIDDEN });
  }
};

//Check access token is expiring or not or it also need to be delete from the cookie after the expired
