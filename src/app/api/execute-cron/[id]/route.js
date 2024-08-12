//This file execution will be done by the cron-job.org which delete the game after end time passed
// app/api/execute-cron/route.js
import { NextResponse } from 'next/server';

import gameDao from '@/lib/daos/gameDao';
import { httpStatusCode } from '@/lib/httpStatusCode';
import { User } from '@/lib/models/userSchema';
import memberServices from '@/lib/services/memberServices';

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

    //Need to optimize the if else logic
    try {
      //For delete each member from the db
      await memberServices.removeMembersFromGame(game);
      //Also need to delete the game ID from the user games array
      await User.updateOne(
        { _id: game?.organizerId },
        { $pull: { games: game?._id } }
      );
      //Then delete the game
      await gameDao.deleteGameById(game._id);
    } catch (error) {
      console.error(`Error deleting game: ${game._id}`, error);
      return NextResponse.json(
        { error },
        {
          status: httpStatusCode.FORBIDDEN,
        }
      );
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
