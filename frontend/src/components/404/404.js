import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./404.css";

const NotFound = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="container_404">
      <h1>404</h1>
      <h2>
        Đường dẫn không tồn tại. Vui lòng{" "}
        <NavLink onClick={handleBack}>quay lại</NavLink>
      </h2>
    </div>
  );
};

export default NotFound;
