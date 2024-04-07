import gameDao from '@/lib/daos/gameDao';
import { connectToDB } from '@/lib/dbHandler';
import { httpStatusCode } from '@/lib/httpStatusCode';
import { getCurrentSession } from '@/lib/nextAuth/auth';
import { NextResponse } from 'next/server';

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
        name: gameOrganizer?.user?.name || gameOrganizer?.token?.name,
      };
      const createdGame = await gameDao.createGame(requestBody, organizer);
      return NextResponse.json(
        { message: 'Succssfully Created!', createdGame, status: 'success' },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: httpStatusCode.FORBIDDEN });
  }
};
