//This file execution will be done by the cron-job.org which delete the game after end time passed
// app/api/execute-cron/route.js
import { NextResponse } from 'next/server';

import { GAME_MEMBER } from '@/constants/role';
import gameDao from '@/lib/daos/gameDao';
import memberDao from '@/lib/daos/memberDao';
import { httpStatusCode } from '@/lib/httpStatusCode';

export async function GET(req, { params }) {
  try {
    const gameId = params?.['id'];

    // Find the game by the provided gameId
    const game = await gameDao.getSingleGame(gameId);

    if (!game) {
      return new Response(JSON.stringify({ error: 'Game not found' }), {
        status: 404,
      });
    }

    const endtime = game.endTime;
    const now = new Date();

    //Need to optimize the if else logic
    if (endtime > now) {
      try {
        //For delete each member from the db
        const getAllMembersOfCurrentGame = game?.members?.filter(
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
        await gameDao.deleteGameById(game._id);
      } catch (error) {
        console.error(`Error deleting game: ${game._id}`, error);
        return new Response(JSON.stringify({ error: 'Error deleting game' }), {
          status: 500,
        });
      }
    } else {
      // If the game's endTime is in the past, delete the game immediately
      try {
        const getAllMembersOfCurrentGame = game?.members?.filter(
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
        await gameDao.deleteGameById(game._id);
      } catch (error) {
        console.error(`Error deleting game: ${game._id}`, error);
        return new Response(JSON.stringify({ error: 'Error deleting game' }), {
          status: 500,
        });
      }
    }

    return new Response(
      JSON.stringify({ message: 'Game deleted successfully' }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error executing cron job' }), {
      status: 500,
    });
  }
}
