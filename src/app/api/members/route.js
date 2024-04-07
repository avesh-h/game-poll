import gameDao from '@/lib/daos/gameDao';
import memberDao from '@/lib/daos/memberDao';
import { connectToDB } from '@/lib/dbHandler';
import { httpStatusCode } from '@/lib/httpStatusCode';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  const memberData = await req.json();
  console.log('memberData', memberData);
  try {
    await connectToDB();
    if (memberData?.email) {
      const game = await gameDao.getSingleGame(memberData?.gameId);
      console.log('Game', game);

      const isSameMemberExist = game?.members?.find(
        (member) => member?.email === memberData?.email
      );
      if (isSameMemberExist) {
        return NextResponse.json(
          { error: 'Same email already exist!', status: 'failed' },
          { status: httpStatusCode.BAD_REQUEST }
        );
      }

      // $and: [{ email: { $eq: memberEmail } }, { gameId: { $eq: gameId } }],

      //   const isExist = await memberDao.findMemberByEmail(memberData?.email);
      //   console.log('isExist', isExist);
      //   if (isExist) {
      //     return NextResponse.json(
      //       { error: 'Same email already exist!', status: 'failed' },
      //       { status: httpStatusCode.BAD_REQUEST }
      //     );
      //   }
    }
    // const game = await gameDao.getSingleGame(memberData?.gameId);

    if (memberData?.gamePassword !== game?.password) {
      return NextResponse.json(
        {
          error: 'Invalid Password!',
          status: 'failed',
        },
        { status: httpStatusCode.FORBIDDEN }
      );
    }
    const createMember = await memberDao.createMember(memberData);
    const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    });
    const response = NextResponse.json(
      { response: createMember, status: 'success' },
      { status: httpStatusCode.CREATED }
    );
    response.cookies.set('accessToken', accessToken);
    return response;
  } catch (error) {
    return NextResponse.json({ error }, { status: httpStatusCode.FORBIDDEN });
  }
};
