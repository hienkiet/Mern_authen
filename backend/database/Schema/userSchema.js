import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    password: {
      type: String,
      RegExp: [/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, "Password is invalid"],
      required: [true, "Password is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isLogin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema, "users");
export default UserModel;
