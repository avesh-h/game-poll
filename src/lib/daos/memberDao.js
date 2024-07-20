import { Member } from '@/lib/models/memberSchema';

class memberDao {
  async findMemberByEmail(memberEmail) {
    return await Member.findOne({ email: memberEmail });
  }

  //Add member
  async createMember(data) {
    delete data?.isNewMember;
    const member = new Member(data);
    try {
      await member.save();
      return member;
    } catch (error) {
      return error;
    }
  }

  //Delete member
  async deleteMember(id) {
    try {
      await Member.findOneAndDelete({ _id: id });
    } catch (error) {
      return error;
    }
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new memberDao();
