import React from "react";

const Banner = ({ imgLink }) => {
  return (
    <div className="banner pb-4">
      <img src={imgLink} alt="" />
    </div>
  );
};

export default Banner;
