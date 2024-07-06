//This file execution will be done by the cron-job.org which delete the game after end time passed
// app/api/execute-cron/route.js
import { NextResponse } from 'next/server';

import { Game } from '@/lib/models/gameSchema';

export async function POST(request) {
  console.log('call executed************************===================>');
  try {
    const { gameId } = await request.json();
    console.log(
      'call executed************************===================>',
      gameId
    );

    // Find the game by the provided gameId
    const game = await Game.findById(gameId);

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        {
          status: 404,
        }
      );
    }

    const endtime = game.endTime;
    const now = new Date();

    if (endtime > now) {
      // If the game's endTime is in the future, schedule the deletion
      try {
        await Game.findByIdAndDelete(game._id);
        console.log(`Deleted game: ${game._id}`);
      } catch (error) {
        console.error(`Error deleting game: ${game._id}`, error);
        return NextResponse.json(
          { error: 'Error deleting game' },
          {
            status: 500,
          }
        );
      }
    } else {
      // If the game's endTime is in the past, delete the game immediately
      try {
        await Game.findByIdAndDelete(game._id);
        console.log(`Deleted game: ${game._id}`);
      } catch (error) {
        console.error(`Error deleting game: ${game._id}`, error);
        return NextResponse.json(
          { error: 'Error deleting game' },
          {
            status: 500,
          }
        );
      }
    }

    return NextResponse.json(
      { message: 'Game deleted successfully' },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error executing cron job:', error);
    return NextResponse.json(
      { error: 'Error executing cron job' },
      {
        status: 500,
      }
    );
  }
}
