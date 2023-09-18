import React from "react";
import "./CardProduct.css";
const CardProduct = ({ dataProduct }) => {
  const { productId, productName, productPrice, productDesc, imgLink } =
    dataProduct;

  const handleAddToCart = (e) => {
    e.preventDefault();
    console.log(e.target.parentElement.dataset.id);
  };
  return (
    <div
      data-id={productId}
      data-price={productPrice}
      className="card card-item"
    >
      <img
        onClick={handleAddToCart}
        src={imgLink}
        className="card-img-top"
        alt="..."
      />

      <div data-id={productId} className="card-body">
        <h4 className="card-title" onClick={handleAddToCart}>
          {productName}
        </h4>
        <p className="card-text">{productDesc}</p>
        <a href="ab" className="mt-2 btn btn-outline-success">
          Add to cart
          <i className="fa-solid fa-cart-shopping ms-1"></i>
        </a>
      </div>
    </div>
  );
};

export default CardProduct;
