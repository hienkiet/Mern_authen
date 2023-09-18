import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: [true, "ProductName is required"],
      unique: true,
    },
    productDesc: {
      type: String,
    },
    brand: {
      type: String,
    },
    imgLink: {
      type: String,
    },
    color: [{ type: String }],
    size: [{ type: Number }],
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", productSchema, "products");
export default ProductModel;
