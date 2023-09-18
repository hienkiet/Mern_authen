import { Router } from "express";
import productController from "../controllers/productController.js";
import middleware from "../controllers/middlewares.js";

const productRouter = Router();

productRouter.post(
  "/api/product/create",
  middleware.checkToolCallAPI,
  middleware.checkAccessToken,
  productController.createProduct
);
middleware.checkToolCallAPI;

productRouter.get(
  "/api/product/getAllProducts",
  middleware.checkToolCallAPI,
  productController.getAllProducts
);

export default productRouter;
