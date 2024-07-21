import memberDao from '../daos/memberDao';
import { GAME_MEMBER } from '@/constants/role';

class memberServices {
  async removeMembersFromGame(game) {
    //For delete each member from the db
    const getAllMembersOfCurrentGame = game?.members?.filter(
      (member) => member?.role === GAME_MEMBER
    );
    if (getAllMembersOfCurrentGame?.length) {
      for (const member of getAllMembersOfCurrentGame) {
        try {
          await memberDao.deleteMember(member?.id);
        } catch (error) {
          return error;
        }
      }
    }
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new memberServices();
