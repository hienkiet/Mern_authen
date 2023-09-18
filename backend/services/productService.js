import productModel from "../database/Schema/productSchema.js";

const productService = {
  // create a new product
  createProduct: async ({
    productName,
    productDesc,
    brand,
    imgLink,
    color,
    size,
    price,
  }) => {
    const newProduct = new productModel({
      productName,
      productDesc,
      brand,
      imgLink,
      color,
      size,
      price,
    });
    return newProduct.save();
  },

  // get all products
  getAllProducts: async () => {
    return productModel.find({});
  },
};

export default productService;
