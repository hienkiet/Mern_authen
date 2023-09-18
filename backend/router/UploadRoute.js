import { Router } from "express"
import UploadModel from "../model/UploadModel.js"
import uploadMiddleware from "../Middlewares/MulterMiddleware.js";

const uploadRouter = Router();

uploadRouter.get("/api/get", async (req, res) => {
  const allPhotos = await UploadModel.find().sort({ createdAt: "descending" });
  res.send(allPhotos);
});

uploadRouter.post("/api/save", uploadMiddleware.single("photo"), (req, res) => {
  const photo = req.file.filename;

  console.log(photo);

  UploadModel.create({ photo })
    .then((data) => {
      console.log("Uploaded Successfully...");
      console.log(data);
      res.send(data);
    })
    .catch((err) => console.log(err));
});

export default uploadRouter;
