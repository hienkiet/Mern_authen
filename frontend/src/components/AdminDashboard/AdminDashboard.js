import React from "react";
import UserAPI from "../../api/userAPI";
import "./AdminDashboard.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

import Loading from "../Loading/Loading";

const AdminDashboard = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  // Handle logout
  const handleLogout = async (e) => {
    e.preventDefault();
    await UserAPI.logout().then((res) => {
      if (res && res.error === "Access token expired") {
        UserAPI.refreshToken();
        UserAPI.logout();
      }
      if (res && res.error === "Malformed access token") {
        toast.error("Bạn chưa đăng nhập!");
        navigate("/");
      }
      if (res && res.message === "Logout") {
        localStorage.removeItem("ptvactk");
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          navigate("/");
        }, 1200);
      }
    });
  };

  return (
    <>
      <div className="container-fluid overflow-auto">
        <div className="row flex-nowrap">
          <div className="col-auto px-sm-2 px-0 bg-light">
            <div className="admin-bar d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
              <NavLink
                to="/admin/dashboard"
                className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-dark text-decoration-none"
              >
                <span className="fs-6 d-none d-sm-inline">ADMIN DASHBOARD</span>
              </NavLink>
              <ul
                className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
                id="menu"
              >
                <li>
                  <NavLink
                    to="/admin/dashboard"
                    className="nav-link align-middle p-2"
                  >
                    <i className="fa-solid fa-house"></i>
                    <span className="ms-1 d-none d-sm-inline ms-2">
                      Trang chủ
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/control/users"
                    className="nav-link align-middle p-2 mt-3"
                  >
                    <i className="fa-solid fa-user"></i>
                    <span className="ms-1 d-none d-sm-inline ms-2">Users</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/admin/control/products"
                    className="nav-link align-middle p-2 mt-3 mb-2"
                  >
                    <i className="fa-solid fa-box-open"></i>
                    <span className="ms-1 d-none d-sm-inline">Products</span>
                  </NavLink>
                </li>
                <li className="admin-separate position-relative">
                  <NavLink to="/" className="nav-link align-middle p-2 mt-2">
                    <i className="fa-solid fa-globe"></i>
                    <span className="ms-1 d-none d-sm-inline">Trang khách</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/"
                    onClick={handleLogout}
                    className="nav-link align-middle p-2 mt-2"
                  >
                    <i className="fa-solid fa-right-from-bracket"></i>
                    <span className="ms-1 d-none d-sm-inline">Đăng xuất</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
          {children}
        </div>
      </div>
      {loading ? <Loading /> : ""}
    </>
  );
};

export default React.memo(AdminDashboard);
