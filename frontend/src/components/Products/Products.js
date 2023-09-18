import React, { useEffect, useState } from "react";
import CardProduct from "../CardProduct/CardProduct";
import productAPI from "../../api/productAPI";
import "./Products.css";

const Products = () => {
  const [dataProducts, setDataProducts] = useState([]);
  useEffect(() => {
    productAPI
      .getAllProducts()
      .then((res) => {
        setDataProducts(res.products);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <div className="products h-auto">
        {dataProducts &&
          dataProducts.map((product) => {
            return <CardProduct key={product._id} dataProduct={product} />;
          })}
      </div>
      <div className="btn-load-more-products text-center p-5">
        <button className="btn btn-outline-secondary">Xem thêm</button>
      </div>
    </>
  );
};

export default React.memo(Products);
