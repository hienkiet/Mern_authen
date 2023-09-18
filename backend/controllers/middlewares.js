import jwt from "jsonwebtoken";
import userService from "../services/userService.js";

const middleware = {
  // check access token
  checkAccessToken: async (req, res, next) => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Don't have access token" });
      }
      try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          return res.status(401).json({ error: "Access token expired" });
        }
        if (error.name === "JsonWebTokenError") {
          return res.status(401).json({ error: "Invalid access token" });
        }
        throw error;
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // check admin
  checkAdmin: async (req, res, next) => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Don't have access token" });
      }
      const decoded = jwt.decode(token);
      const id = decoded?.id;
      const user = await userService.getUserById(id);
      if (user.length === 0) {
        return res.status(400).json({ error: "User does not exist" });
      }
      if (!user[0]?.isAdmin) {
        return res.status(403).json({ error: "You don't have permission" });
      }
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // check tool call api
  checkToolCallAPI: async (req, res, next) => {
    const allowedOrigins = [process.env.FRONTEND_URL];
    const origin = req.headers.origin;
    if (!allowedOrigins.includes(origin)) {
      return res
        .status(403)
        .json({ error: "You don't have permission to call API" });
    }
    next();
  },
};

export default middleware;
