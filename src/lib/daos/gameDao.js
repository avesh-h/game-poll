import { Game } from '../models/gameSchema';

class gameDao {
  async createGame(data, organizer) {
    const game = new Game(data);
    game.members.push(organizer);
    await game.save();
    return game;
  }

  async getSingleGame(gameId) {
    return await Game.findById(gameId);
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new gameDao();
