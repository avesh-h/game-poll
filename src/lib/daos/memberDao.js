import { Member } from '@/lib/models/memberSchema';

class memberDao {
  async findMemberByEmail(memberEmail, gameId) {
    return await Member.findOne({ email: memberEmail });
  }

  //Add member
  async createMember(data) {
    const member = new Member(data);
    try {
      await member.save();
      return member;
    } catch (error) {
      return error;
    }
  }
}

export default new memberDao();
