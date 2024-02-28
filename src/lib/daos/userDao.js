import { User } from "../models/userSchema";

class UserDao {
  async findUserByEmail(email) {
    return await User.findOne({ email });
  }
}

export default new UserDao();
