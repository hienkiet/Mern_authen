import productService from "../services/productService.js";
const productController = {
  // create a new product
  createProduct: async (req, res) => {
    try {
      const { productName, productDesc, brand, imgLink, color, size, price } =
        req.body;
      if (!productName || !price) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const newProduct = await productService.createProduct({
        productName,
        productDesc,
        brand,
        imgLink,
        color,
        size,
        price,
      });
      return res.status(200).json({ message: "Create product successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // get all products
  getAllProducts: async (req, res) => {
    try {
      const products = await productService.getAllProducts();
      return res.status(200).json({ products });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default productController;
