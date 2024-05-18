/* eslint-disable import/no-anonymous-default-export */
import { ObjectId } from 'mongodb';

import { Game } from '../models/gameSchema';

class gameDao {
  async createGame(data, organizer) {
    const game = new Game(data);
    game.members[0] = organizer;
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

  async findGamesByOrganizerId(id) {
    const games = await Game.find({ organizerId: id });
    return games;
  }

  async updateGame(id, updateGame) {
    const updatedGame = await Game.findByIdAndUpdate(id, updateGame, {
      new: true,
    });
    return updatedGame;
  }

  async deleteGameById(id) {
    return await Game.findByIdAndDelete(id);
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

      //Player added and update in both below same logic
      game.members[playerData?.memberIndex || playerData?.playerIndex] =
        playerData;

      // Save the updated game document
      const updatedGame = await game.save();
      return updatedGame;
    } catch (error) {
      return error;
    }
  }

  //Delete member from the game
  async deletePlayerFromGameById(gameId, playerId) {
    //This code deleting the whole member element from the array ,but we want to remove some fields from the array so it cannot remove required fields like index and memberIndex
    const deletedMember = Game.updateOne(
      {
        _id: gameId,
      },
      //Empty these fields of the member
      {
        $unset: {
          'members.$[elem].playerName': '',
          'members.$[elem].id': '',
          'members.$[elem].role': '',
          'members.$[elem].position': '',
          'members.$[elem].email': '',
          'members.$[elem].gameId': '',
        },
      },
      //To get the perticular element from the members array.
      { arrayFilters: [{ 'elem.id': playerId }] }
    );
    return deletedMember;
  }
}

export default new gameDao();

//Aggregation methods try

//To delete the member from the game
// const deletedMember = Game.updateOne(
//   { _id: gameId },
//   { $pull: { members: { id: playerId } } }
// );

//TO find the perticular member from the game id with member id
// const pipeline = [
//   {
//     $match:
//       /**
//        * query: The query in MQL.
//        */
//       {
//         _id: ObjectId('6640d1d325561194191d2f30'),
//       },
//   },
//   {
//     $project:
//       /**
//        * specifications: The fields to
//        *   include or exclude.
//        */
//       {
//         _id: 0,
//         members: {
//           $filter: {
//             input: '$members',
//             as: 'member',
//             cond: {
//               $eq: ['$$member.id', ObjectId('66463f84a705dd67309f4a10')],
//             },
//           },
//         },
//       },
//   },
// ];
