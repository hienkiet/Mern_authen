import bcrypt from "bcrypt";
import userService from "../services/userService.js";
import jwt from "jsonwebtoken";
import UserModel from "../database/Schema/userSchema.js";
import nodemailer from "nodemailer";
import multer from "multer";
import mime from "mime-types";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png"];
    const fileMime = mime.lookup(file.originalname);

    if (allowedMimes.includes(fileMime)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG and PNG image files are allowed."
        )
      );
    }
  },
});

const userController = {
  // login
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Check if username exists
      const exitUser = await userService.getUserByUsername(username);

      if (exitUser.length === 0) {
        return res.status(400).json({ error: "Username does not exist" });
      }

      // Check if password is correct

      const passwordCorrect = bcrypt.compareSync(
        password,
        exitUser[0].password
      );
      if (!passwordCorrect)
        return res.status(400).json({ error: "Password is incorrect" });

      if (exitUser.length > 0 && passwordCorrect) {
        const accessToken = jwt.sign(
          {
            id: exitUser[0]._id,
            isAdmin: exitUser[0].isAdmin,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1min" }
        );

        const refreshToken = jwt.sign(
          {
            id: exitUser[0]._id,
            isAdmin: exitUser[0].isAdmin,
          },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        // set cookie
        await res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // set login status
        await UserModel.updateOne(
          { _id: exitUser[0]._id },
          { isLogin: true },
          { new: true }
        );

        return res.status(200).json({
          message: "Login successfully",
          accessToken,
          username: exitUser[0].username,
          isAdmin: exitUser[0].isAdmin,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // register
  register: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Check if username already exists
      const user = await userService.getUserByUsername(username);
      if (user.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Hash password
      const hashPassword = bcrypt.hashSync(password, 10);

      // Create new user
      const newUser = await userService.createUser(username, hashPassword);
      if (newUser.error) {
        return res.status(400).json({ error: newUser.error });
      }

      return res.status(200).json({ message: "Register successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // get profile
  getProfile: async (req, res) => {
    try {
      const id = req.user.id;
      const user = await userService.getUserById(id);
      if (user.length === 0) {
        return res.status(400).json({ error: "User does not exist" });
      }
      const data = {
        username: user[0].username,
      };
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: "Internal server error" });
    }
  },
  // refresh token
  refreshToken: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken)
        return res.status(401).json({ error: "Don't have refresh token" });
      if (jwt.decode(refreshToken).exp < Date.now() / 1000) {
        return res.status(401).json({ error: "Refresh token expired" });
      }
      const verified = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      const newAccessToken = jwt.sign(
        {
          id: verified.id,
          isAdmin: verified.isAdmin,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10min" }
      );
      return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  // check login
  checkLogin: async (req, res) => {
    try {
      const accessToken = req.headers["authorization"].split(" ")[1];
      if (!accessToken) return res.status(200).json({ isLogin: false });
      const verified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      if (!verified) return res.status(200).json({ isLogin: false });
      const user = await userService.getUserById(verified.id);
      if (user.length === 0) {
        return res.status(400).json({ error: "User does not exist" });
      }
      if (user[0].isLogin) {
        return res.status(200).json({ username: user.username, isLogin: true });
      }
      return res.status(200).json({ isLogin: false });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // forget password
  forgetPassword: async (req, res) => {
    try {
      const { username, emailForgetPass } = req.body;
      const user = await userService.getUserByUsername(username);
      if (user.length === 0) {
        return res.status(400).json({ error: "Username does not exist" });
      }
      // send email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
        secure: false,
        tls: {
          rejectUnauthorized: false,
        },
      });

      // random password
      const newPassword = Math.random().toString(36).slice(-8);

      const mailOptions = {
        from: process.env.EMAIL,
        to: emailForgetPass,
        subject: "Reset password",
        text: `Vui lòng dùng mật khẩu tạm thời này để đăng nhập và đổi mật khẩu ngay: ${newPassword}`,
      };

      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          return res.status(400).json({ error: "Email does not exist" });
        } else if (info) {
          await UserModel.updateOne(
            { _id: user[0]._id },
            { password: bcrypt.hashSync(newPassword, 10) },
            { new: true }
          );
          return res.status(200).json({ message: "Send email successfully" });
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // logout
  logout: async (req, res) => {
    try {
      const accessToken = req.headers["authorization"].split(" ")[1];
      if (!accessToken) return res.status(200).json({ message: "Logouted" });
      const verified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      if (!verified) return res.status(200).json({ error: "Invalid token" });
      const user = await userService.getUserById(req.user.id);
      if (user.length === 0) {
        return res.status(400).json({ error: "User does not exist" });
      }

      if (!user[0].isLogin) {
        res.clearCookie("refreshToken");
        return res.status(400).json({ error: "User is not login" });
      }

      if (user[0].isLogin) {
        await UserModel.updateOne(
          { _id: verified.id },
          { isLogin: false },
          { new: true }
        );
        // remove refresh token from cookie
        res.clearCookie("refreshToken");
        return res.status(200).json({ status: "success", message: "Logout" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // get admin role
  getRole: async (req, res) => {
    try {
      const accessToken = req.headers["authorization"].split(" ")[1];
      if (!accessToken) return res.status(200).json({ isLogin: false });
      const verified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      if (!verified) return res.status(400).json({ isAdmin: false });
      res.status(200).json({ isAdmin: verified.isAdmin });
    } catch {
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      if (users.length === 0) {
        return res.status(400).json({ error: "Don't have any user" });
      }
      // rest except my account
      let data = users.filter((user) => user._id.toString() !== req.user.id);
      // remove password from response
      data = data.map((user) => {
        return {
          _id: user._id,
          username: user.username,
          isAdmin: user.isAdmin,
        };
      });

      return res.status(200).json({ message: "Success", data });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // admin search user
  adminSearchUser: async (req, res) => {
    try {
      const { username } = req.params;
      let user = await userService.getUserByUsername(username);
      if (user.length === 0) {
        return res.status(400).json({ error: "User does not exist" });
      }

      // remove password from response
      user = user.map((user) => {
        return {
          _id: user._id,
          username: user.username,
          isAdmin: user.isAdmin,
        };
      });

      return res.status(200).json({ message: "Success", user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // edit user
  editUser: async (req, res) => {
    try {
      const { userID, username, isAdmin } = req.body;
      const user = await userService.getUserByUsername(username);
      if (user.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      }
      const newUser = await userService.editUser(userID, username, isAdmin);
      if (newUser.error) {
        return res.status(400).json({ error: newUser.error });
      }
      return res.status(200).json({ message: "Edit user successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // delete user
  deleteUser: async (req, res) => {
    try {
      const { userID } = req.body;
      const user = await userService.getUserById(userID);
      if (user.length === 0) {
        return res.status(400).json({ error: "User does not exist" });
      }

      // check if this account is my account
      if (user[0]._id.toString() === req.user.id) {
        return res.status(400).json({ error: "Can't delete your account" });
      }

      // check user online
      if (user[0].isLogin) {
        return res.status(400).json({ error: "User is online" });
      }

      const newUser = await userService.deleteUser(userID);
      if (newUser.error) {
        return res.status(400).json({ error: newUser.error });
      }
      return res.status(200).json({ message: "Delete user successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  uploadProfileImage: async (req, res) => {
    try {
      upload.single("image")(req, res, (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        // Trả về tên file tạm thời để hiển thị preview
        const imageBuffer = req.file.buffer.toString("base64");
        const imageSrc = `data:${req.file.mimetype};base64,${imageBuffer}`;

        return res.status(200).json({ previewSrc: imageSrc });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default userController;
