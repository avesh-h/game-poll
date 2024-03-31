import gameDao from '@/lib/daos/gameDao';
import { connectToDB } from '@/lib/dbHandler';
import { httpStatusCode } from '@/lib/httpStatusCode';
import { NextResponse } from 'next/server';

//We can also directly use the server action of next 14 instad of create the new api here.
export const GET = async (request, { params }) => {
  const gameId = params?.['game-id'];
  try {
    await connectToDB();
    const selectedGame = await gameDao.getSingleGame(gameId);
    if (selectedGame) {
      return NextResponse.json(
        { selectedGame, status: 'success' },
        { status: httpStatusCode.OK }
      );
    }
    return NextResponse.json(
      { error: 'Not found!' },
      { status: httpStatusCode.NOT_FOUND }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: httpStatusCode.FORBIDDEN });
  }
};
