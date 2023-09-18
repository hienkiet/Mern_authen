import React from "react";
const Carousel = React.lazy(() => import("../components/Carousel/Carousel"));
const Products = React.lazy(() => import("../components/Products/Products"));
const Banner = React.lazy(() => import("../components/Banner/Banner"));

const HomePage = () => {
  return (
    <div className="d-flex flex-column">
      <Carousel />
      <h4 className="text-center mt-4 p-4">SẢN PHẨM NỔI BẬT</h4>
      <Products />
      <Banner
        imgLink={
          "https://res.cloudinary.com/dwplockls/image/upload/v1692621993/shoesStoreFullStack/banner_separate1_tftuuq.webp"
        }
      />
      <h4 className="text-center p-4">SẢN PHẨM MỚI</h4>
      <Products />
      <Banner
        imgLink={
          "https://res.cloudinary.com/dwplockls/image/upload/v1692621992/shoesStoreFullStack/FENG_CHEN_WANG_SPRING_SUMMER_23_ct45mj.webp"
        }
      />
    </div>
  );
};

export default HomePage;
