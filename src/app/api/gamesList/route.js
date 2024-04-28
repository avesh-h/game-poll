import { NextResponse } from 'next/server';

import gameDao from '@/lib/daos/gameDao';
import { connectToDB } from '@/lib/dbHandler';
import { httpStatusCode } from '@/lib/httpStatusCode';
import { getCurrentSession } from '@/lib/nextAuth/auth';

const getAllGames = async () => {
  const gameOrganizer = await getCurrentSession();
  try {
    await connectToDB();
    if (gameOrganizer) {
      const games = await gameDao?.findGamesByOrganizerId(
        gameOrganizer?.user?.id
      );
      return NextResponse.json(
        { games, message: 'success' },
        { status: httpStatusCode.OK }
      );
    } else {
      //User unauthorized!
    }
  } catch (error) {
    console.log('error', error);
  }
};

export { getAllGames as GET };
