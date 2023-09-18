import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${uuidv4()}_${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
//Check type
// import imageType from "image-type";

// const isImage = (buffer) => {
//   try {
//     const type = imageType(buffer);
//     return type && type.mime.startsWith("image");
//   } catch (error) {
//     console.error("Error determining image type:", error);
//     return false;
//   }
// };



    // Check content
  //   const buffer = file.buffer;

  //   if (!buffer || buffer.length === 0) {
  //     cb(new Error("Invalid file buffer"), false);
  //     return;
  //   }

  //   if (!isImage(buffer)) {
  //     cb(new Error("Invalid image file"), false);
  //     return;
  //   }

  //   cb(null, true);
  // } catch (error) {
  //   console.error("Error during file filtering:", error);
  //   cb(error, false);
  // }


const uploadMiddleware = multer({ storage, fileFilter });

export default uploadMiddleware;
