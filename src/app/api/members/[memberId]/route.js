import { NextResponse } from 'next/server';

import gameDao from '@/lib/daos/gameDao';
import { connectToDB } from '@/lib/dbHandler';
import { httpStatusCode } from '@/lib/httpStatusCode';

const removeMemberHandler = async (req, { params }) => {
  const { gameId } = await req.json();
  try {
    await connectToDB();
    const existedMember = await gameDao.findMemberWithId(
      gameId,
      params?.memberId
    );
    if (!existedMember) {
      return NextResponse.json(
        { message: 'Player is Not found!', status: 'failed' },
        { status: httpStatusCode.NOT_FOUND }
      );
    }
    const member = await gameDao.deletePlayerFromGameById(
      gameId,
      params?.memberId
    );
    if (member?.modifiedCount) {
      return NextResponse.json(
        {
          message: 'Successfully Removed!',
          status: 'success',
        },
        { status: httpStatusCode.OK }
      );
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: httpStatusCode.FORBIDDEN });
  }
};

export { removeMemberHandler as DELETE };
