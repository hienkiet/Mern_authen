import instance from "./axiosConfig";

const productAPI = {
  // [GET] get all product in homepage
  getAllProducts: async () => {
    return await instance
      .get("/api/product/getAllProducts")
      .then(function (response) {
        return response?.data;
      })
      .catch(function (error) {
        return error?.response?.data;
      });
  },
};

export default productAPI;
