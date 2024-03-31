'use server';

import gameDao from '../daos/gameDao';
import { connectToDB } from '../dbHandler';

//Server action
export async function getSingleGame(params) {
  try {
    await connectToDB();
    const selectedGame = await gameDao.getSingleGame(params);
    if (selectedGame) {
      return selectedGame;
    }
  } catch (error) {
    console.log('errr', error);
  }
}
