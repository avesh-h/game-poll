import { ObjectId } from 'mongodb';

import { Game } from '../models/gameSchema';

class gameDao {
  async createGame(data, organizer) {
    const game = new Game(data);
    game.members.push(organizer);
    await game.save();
    return game;
  }

  async getSingleGame(gameId) {
    return await Game.findById({ _id: gameId });
  }

  async findMemberWithId(gameId, playerId) {
    const member = await Game.find(
      { _id: gameId },
      { members: { $elemMatch: { id: playerId } } }
    );
    if (member?.length) {
      if (member?.[0]?.members?.length && member?.[0]?.members?.[0]) {
        return member?.[0]?.members?.[0];
      }
    }
    return member;
  }

  async findMemberWithEmailOrName(gameId, playerEmail, playerName) {
    try {
      const member = await Game.aggregate([
        {
          $match: {
            _id: new ObjectId(gameId),
            $or: [
              { 'members.playerName': playerName },
              { 'members.email': playerEmail },
            ],
          },
        },
        {
          $project: {
            _id: 0,
            members: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: '$members',
                    cond: {
                      $or: [
                        { $eq: ['$$this.playerName', playerName] },
                        { $eq: ['$$this.email', playerEmail] },
                      ],
                    },
                  },
                },
                0,
              ],
            },
          },
        },
      ]);
      if (member[0]?.members) {
        return member[0]?.members;
      }
      throw Error('Player does not exist!');
    } catch (error) {
      return {
        message: error?.message,
      };
    }
  }

  // Function to update member field based on gameId and memberId
  async addOrUpdateMembersField(gameId, memberId, playerData) {
    try {
      // Find the game document based on gameId
      const game = await Game.findOne({ _id: gameId });

      if (!game) {
        return game; // Handle case where game with given ID is not found
      }

      // Find the index of the member with memberId in the members array
      const memberIndex = game.members.findIndex(
        (member) => String(member.id) === memberId
      );

      if (memberIndex === -1) {
        //Player entry for first time
        game?.members?.push(playerData);
      } else {
        // Update the specific field of the member
        game.members[memberIndex].playerName = playerData?.playerName;
        game.members[memberIndex].position = playerData?.position;
        game.members[memberIndex].email = playerData?.email;
      }
      // Save the updated game document
      const updatedGame = await game.save();
      return updatedGame;
    } catch (error) {
      return error;
    }
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new gameDao();
