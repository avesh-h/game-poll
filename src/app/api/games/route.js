import { NextResponse } from 'next/server';

import gameDao from '@/lib/daos/gameDao';
import userDao from '@/lib/daos/userDao';
import { connectToDB } from '@/lib/dbHandler';
import { httpStatusCode } from '@/lib/httpStatusCode';
import { getCurrentSession } from '@/lib/nextAuth/auth';
import { sendMail } from '@/lib/oAuth2';
import { gameDetails } from '@/lib/utils/common';

export const POST = async (req) => {
  const requestBody = await req.json();
  try {
    await connectToDB();
    const gameOrganizer = await getCurrentSession();
    const gameOrganizerId =
      gameOrganizer?.user?.id || gameOrganizer?.token?.userId;
    if (gameOrganizer) {
      const organizer = {
        id: gameOrganizerId,
        email: gameOrganizer?.user?.email || gameOrganizer?.token?.email,
        role: 'organizer',
        playerName: gameOrganizer?.user?.name || gameOrganizer?.token?.name,
        playerIndex: 0,
        ...(requestBody?.gameType === 'team' ? { team: 'teamA' } : {}),
      };
      requestBody.organizerId = gameOrganizerId;
      const createdGame = await gameDao.createGame(requestBody, organizer);
      if (createdGame) {
        //Mail service
        await sendMail({
          mailTo: gameOrganizer?.user?.email,
          subject: 'Created Game Successfully!',
          text: gameDetails({ session: gameOrganizer, gameInfo: createdGame }),
        });
        //Update the user games array
        await userDao.addGameIntoUserById(gameOrganizerId, createdGame?._id);
      }
      return NextResponse.json(
        { message: 'Succssfully Created!', createdGame, status: 'success' },
        { status: 201 }
      );
    }
  } catch (error) {
    // console.log('error', error);
    return NextResponse.json({ error }, { status: httpStatusCode.FORBIDDEN });
  }
};
