import { Member } from '@/lib/models/memberSchema';

class memberDao {
  async findMemberByEmail(memberEmail, gameId) {
    return await Member.findOne({ email });
  }
  async createMember(data) {
    const member = new Member(data);
    await member.save();
    return member;
  }
}

export default new memberDao();
