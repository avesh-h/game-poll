import { NextResponse } from 'next/server';

import { connectToDB } from '@/lib/dbHandler';
import { httpStatusCode } from '@/lib/httpStatusCode';
import { User } from '@/lib/models/userSchema';
import { getCurrentSession } from '@/lib/nextAuth/auth';

const getAllGames = async () => {
  const gameOrganizer = await getCurrentSession();
  try {
    await connectToDB();
    if (gameOrganizer) {
      //Now we getting games directly from users instead of all games from game schema.
      const userGames = await User.findOne(
        {
          _id: gameOrganizer?.user?.id,
        },
        { games: 1, _id: 0 }
      ).populate('games');

      return NextResponse.json(
        { games: userGames?.games, status: 'success' },
        { status: httpStatusCode.OK }
      );
    } else {
      //User unauthorized!
      return NextResponse.json(
        {
          error: 'User is unauthorized!',
          status: 'failed',
        },
        { status: httpStatusCode.FORBIDDEN }
      );
    }
  } catch (error) {
    console.log('error', error);
  }
};

export { getAllGames as GET };
