/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import UserAPI from "../../api/userAPI";
import Loading from "../Loading/Loading";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Header.css";

const Header = React.memo(() => {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("ptvactk");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setIsAdmin(decoded?.isAdmin || false);
      } catch (error) {
        console.log(error);
        console.log("Lỗi decode token");
      }
    }
  }, [token]);

  const handleLogout = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const res = await UserAPI.logout();
        if (res?.error === "Access token expired") {
          await UserAPI.refreshToken();
          await UserAPI.logout();
        }
        if (res?.error === "Malformed access token") {
          navigate("/");
        }
        if (res?.error === "Don't have access token") {
          toast.error("Không thể đăng xuất");
        }

        if (res?.error === "Invalid access token") {
          toast.error("Không thể đăng xuất");
        }

        if (res?.error === "User is not login") {
          localStorage.removeItem("ptvactk");
          toast.error("Bạn chưa đăng nhập");
          navigate("/");
        }

        if (res?.message === "Logout") {
          localStorage.removeItem("ptvactk");
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            navigate("/");
          }, 600);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [navigate]
  );

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top shadow-sm">
        <div className="container-fluid d-flex justify-content-between h-100">
          <NavLink className="navbar-brand" to="/">
            <img
              style={{ width: "100px", height: "72px" }}
              src="https://res.cloudinary.com/dwplockls/image/upload/v1691863606/shoesStoreFullStack/logo_avi1va.png"
              alt="Test"
            />
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
           <div className="collapse navbar-collapse" id="navbarSupportedContent">
           {/*<ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" exact="true" to="/">
                  TRANG CHỦ
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/api/products/mlb">
                  MLB
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/api/products/nike">
                  NIKE
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/api/products/converse">
                  CONVERSE
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  OTHERS
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/api/products/adidas"
                    >
                      ADIDAS
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/api/products/jordan"
                    >
                      JORDAN
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/api/products/balance"
                    >
                      BALANCE
                    </NavLink>
                  </li>
                </ul>
              </li>
            </ul>
            <form className="d-flex">
              <input
                className="form-control me-1 shadow-none"
                type="text"
                placeholder="Nhập tên sản phẩm"
                aria-label="Search"
              />
              <button className="btn btn-success" type="submit">
                Search
              </button>
            </form> */}
            <div className="header-control d-flex flex-row pt-2 pt-sm-2 pt-md-2 pt-lg-0 ms-lg-2">
              {/* cart
              <NavLink
                to="/me/cart"
                className="header-cart rounded-circle d-flex align-items-center justify-content-center"
              >
                <i className="fa-solid fa-cart-shopping"></i>
              </NavLink> */}
              {/* user */}
              <div className="header-user rounded-circle ms-2 d-flex align-items-center justify-content-center dropdown">
                {token ? (
                  <i className="fa-solid fa-user"></i>
                ) : (
                  <i className="fa-solid fa-right-to-bracket"></i>
                )}

                <div className="account-dropdown dropdown-menu dropdown-menu-end">
                  {token ? (
                    <NavLink className="dropdown-item" to="/upload">
                      Test
                    </NavLink>
                  ) : (
                    <NavLink className="dropdown-item" to="/login">
                      Đăng nhập
                    </NavLink>
                  )}
                  {token ? (
                    <NavLink className="dropdown-item" to="/me/profile">
                      Tài khoản
                    </NavLink>
                  ) : (
                    ""
                  )}

                  {token && isAdmin ? (
                    <NavLink className="dropdown-item" to="/admin/dashboard">
                      Quản lý
                    </NavLink>
                  ) : (
                    ""
                  )}

                  {token ? (
                    <>
                      <hr className="dropdown-divider"></hr>
                      <NavLink
                        className="dropdown-item"
                        to="/logout"
                        onClick={handleLogout}
                      >
                        Đăng xuất
                      </NavLink>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer autoClose={1600} />
      </nav>
      {loading ? <Loading /> : ""}
    </>
  );
});

export default Header;
