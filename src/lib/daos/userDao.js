import { User } from '../models/userSchema';

class UserDao {
  async findUserByEmail(email) {
    return await User.findOne({ email }).lean();
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new UserDao();
