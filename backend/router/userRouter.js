import { Router } from "express";
import userController, {upload} from "../controllers/userController.js";
import middleware from "../controllers/middlewares.js";

const userRouter = Router();

// login
userRouter.post("/login", middleware.checkToolCallAPI, userController.login);

// register
userRouter.post(
  "/register",
  middleware.checkToolCallAPI,
  userController.register
);

// forget password
userRouter.post(
  "/forget_password",
  middleware.checkToolCallAPI,
  userController.forgetPassword
);

// log out
userRouter.get(
  "/logout",
  middleware.checkToolCallAPI,
  middleware.checkAccessToken,
  userController.logout
);

// get user profile
userRouter.get(
  "/me/profile",
  middleware.checkToolCallAPI,
  middleware.checkAccessToken,
  userController.getProfile
);

userRouter.post(
  "/me/upload-profile-image",
  middleware.checkToolCallAPI,
  middleware.checkAccessToken,
  upload.single("image"),
  userController.uploadProfileImage
);

// refresh token
userRouter.post(
  "/refresh_token",
  middleware.checkToolCallAPI,
  userController.refreshToken
);

// check login
userRouter.get(
  "/check_login",
  middleware.checkToolCallAPI,
  middleware.checkAccessToken,
  userController.checkLogin
);

// check admin role
userRouter.get(
  "/api/getRole",
  middleware.checkToolCallAPI,
  middleware.checkAccessToken,
  userController.getRole
);

// get all users
userRouter.get(
  "/api/getAllUsers",
  middleware.checkToolCallAPI,
  middleware.checkAccessToken,
  userController.getAllUsers
);

// admin search user
userRouter.get(
  "/admin/control/user/search/:username",
  middleware.checkToolCallAPI,
  middleware.checkAccessToken,
  middleware.checkAdmin,
  userController.adminSearchUser
);

// edit user
userRouter.put(
  "/api/control/editUser",
  middleware.checkToolCallAPI,
  middleware.checkAccessToken,
  middleware.checkAdmin,
  userController.editUser
);

// delete user
userRouter.delete(
  "/api/control/deleteUser",
  middleware.checkToolCallAPI,
  middleware.checkAccessToken,
  middleware.checkAdmin,
  userController.deleteUser
);

export default userRouter;
