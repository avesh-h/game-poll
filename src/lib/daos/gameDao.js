import { Game } from "../models/gameSchema";

class gameDao {
  async createGame(data) {
    const game = new Game(data);
    await game.save();
    return game;
  }
}

export default new gameDao();
