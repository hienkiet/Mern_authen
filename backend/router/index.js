import userRouter from "./userRouter.js";
import productRouter from "./productRouter.js";
import uploadRouter from "./UploadRoute.js";
export default function appRouter(app) {
  app.use("/", userRouter);
  app.use("/", productRouter);
  app.use("/", uploadRouter);
}
