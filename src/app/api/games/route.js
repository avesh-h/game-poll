import { NextResponse } from 'next/server';

import gameDao from '@/lib/daos/gameDao';
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
    if (gameOrganizer) {
      const organizer = {
        id: gameOrganizer?.user?.id || gameOrganizer?.token?.userId,
        email: gameOrganizer?.user?.email || gameOrganizer?.token?.email,
        role: 'organizer',
        playerName: gameOrganizer?.user?.name || gameOrganizer?.token?.name,
        playerIndex: 0,
        ...(requestBody?.gameType === 'team' && { team: 'teamA' }),
      };
      requestBody.organizerId =
        gameOrganizer?.user?.id || gameOrganizer?.token?.userId;
      const createdGame = await gameDao.createGame(requestBody, organizer);
      if (createdGame) {
        //Mail service
        await sendMail({
          mailTo: gameOrganizer?.user?.email,
          subject: 'Created Game Successfully!',
          text: gameDetails({ session: gameOrganizer, gameInfo: createdGame }),
        });
      }
      return NextResponse.json(
        { message: 'Succssfully Created!', createdGame, status: 'success' },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: httpStatusCode.FORBIDDEN });
  }
};
