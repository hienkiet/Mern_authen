import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDatabase from "./database/mongoose.js";
import appRouter from "./router/index.js";
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

// dev mode
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);

connectDatabase();

app.get("/", (req, res) => res.send("Server is ready"));
appRouter(app);
app.listen(process.env.PORT || 5000, () =>
  console.log(`Server is running on ${process.env.PORT}`)
);
