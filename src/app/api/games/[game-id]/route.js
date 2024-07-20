import { NextResponse } from 'next/server';

import { GAME_MEMBER } from '@/constants/role';
import gameDao from '@/lib/daos/gameDao';
import memberDao from '@/lib/daos/memberDao';
import { connectToDB } from '@/lib/dbHandler';
import { httpStatusCode } from '@/lib/httpStatusCode';
import { getCurrentSession } from '@/lib/nextAuth/auth';

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
  const session = await getCurrentSession();

  try {
    //TODO:Update only members field in the schema
    await connectToDB();
    const selectedGame = await gameDao.getSingleGame(gameId);
    if (selectedGame) {
      if (session && playerData?.role === GAME_MEMBER && !playerData?.id) {
        //If session is present and role is member then organizer adding or editing member.
        const createMember = {
          gamePassword: selectedGame?.gamePassword,
          name: playerData?.playerName,
          gameId: playerData?.gameId,
        };
        const addedMember = await memberDao.createMember(createMember);
        if (addedMember?.message) {
          //Handle proper global error handling in api
          return NextResponse.json(
            { error: addedMember?.message },
            { status: httpStatusCode.FORBIDDEN }
          );
        }
        playerData.id = addedMember?._id;
      }
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
    console.log('error::::::::::::::::::', error);
    return NextResponse.json({ error }, { status: httpStatusCode.FORBIDDEN });
  }
};

const updateGame = async (req, context) => {
  const requestBody = await req.json();
  const gameId = context?.params?.['game-id'];

  try {
    await connectToDB();
    const selectedGame = await gameDao.getSingleGame(
      requestBody?.gameId || gameId
    );
    if (!selectedGame) {
      return NextResponse.json(
        { error: 'Not found!' },
        { status: httpStatusCode.BAD_REQUEST }
      );
    }
    const updatedGame = await gameDao.updateGame(
      requestBody?.gameId || gameId,
      requestBody
    );
    return NextResponse.json(
      { updatedGame, status: 'success' },
      { status: httpStatusCode.OK }
    );
  } catch (error) {
    // console.log('error::::::::::::::::::', error);
    return NextResponse.json({ error }, { status: httpStatusCode.FORBIDDEN });
  }
};

const deleteGame = async (req, ctx) => {
  const gameId = ctx?.params?.['game-id'];
  try {
    if (!gameId) {
      return NextResponse.json(
        { message: 'Invalid request!', status: 'failed' },
        { status: httpStatusCode.BAD_REQUEST }
      );
    }
    await connectToDB();
    const findGame = await gameDao.getSingleGame(gameId);
    if (!findGame) {
      return NextResponse.json(
        { error: 'Not found!', status: 'failed' },
        { status: httpStatusCode.NOT_FOUND }
      );
    }

    //For delete each member from the db
    const getAllMembersOfCurrentGame = findGame?.members?.filter(
      (member) => member?.role === GAME_MEMBER
    );

    if (getAllMembersOfCurrentGame?.length) {
      for (const member of getAllMembersOfCurrentGame) {
        try {
          await memberDao.deleteMember(member?.id);
        } catch (error) {
          return NextResponse.json(
            { error },
            { status: httpStatusCode.FORBIDDEN }
          );
        }
      }
    }
    await gameDao.deleteGameById(gameId);
    //Also delete all the members related to the game except the organizer
    return NextResponse.json(
      { message: 'Successfully removed!', status: 'success' },
      { status: httpStatusCode.OK }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: httpStatusCode.FORBIDDEN });
  }
};

export { deleteGame as DELETE, updateGame as PUT };
