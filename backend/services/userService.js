import UserModel from "../database/Schema/userSchema.js";

const userService = {
  // Create a new user
  createUser: async (username, password) => {
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return { error: "Username already exists" };
    }
    const newUser = new UserModel({ username, password });
    return newUser.save();
  },

  // Get user by username
  getUserByUsername: async (username) => {
    return UserModel.find({ username });
  },
  // Get user by id
  getUserById: async (id) => {
    return UserModel.find({ _id: id });
  },

  getAllUsers: async () => {
    return UserModel.find({});
  },

  // Update user info
  editUser: async (id, username, isAdmin) => {
    return UserModel.updateOne(
      { _id: id },
      { username, isAdmin },
      { new: true }
    );
  },

  // forget password
  forgetPassword: async (username, newPassword) => {
    return UserModel.updateOne(
      { username },
      { password: newPassword },
      { new: true }
    );
  },

  // Delete user
  deleteUser: async (id) => {
    return UserModel.deleteOne({ _id: id });
  },
};

export default userService;
