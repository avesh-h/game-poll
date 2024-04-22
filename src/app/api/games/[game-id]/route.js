import { NextResponse } from 'next/server';

import gameDao from '@/lib/daos/gameDao';
import { connectToDB } from '@/lib/dbHandler';
import { httpStatusCode } from '@/lib/httpStatusCode';

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

export const POST = async (request) => {
  const playerData = await request.json();
  const gameId = playerData?.gameId;
  try {
    //TODO:Update only members field in the schema
    await connectToDB();
    const selectedGame = await gameDao.getSingleGame(gameId);
    if (selectedGame) {
      //For update or add the member
      const updatedGame = await gameDao.addOrUpdateMembersField(
        gameId,
        playerData?.id,
        playerData
      );
      return NextResponse.json(
        { game: updatedGame, status: 'success' },
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
