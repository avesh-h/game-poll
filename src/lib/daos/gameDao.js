import { Game } from '../models/gameSchema';

class gameDao {
  async createGame(data) {
    const game = new Game(data);
    await game.save();
    return game;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new gameDao();
