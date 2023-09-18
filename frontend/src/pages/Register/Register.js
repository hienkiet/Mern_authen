import React, { useEffect } from "react";
import "./Register.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink, useNavigate } from "react-router-dom";
import UserAPI from "../../api/userAPI";

const RegisterPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    UserAPI.checkLogin().then((res) => {
      if (res && res.error === "Access token expired") {
        UserAPI.refreshToken().then((res) => {
          if (res && res.error === "Refresh token expired") {
            setTimeout(() => {
              navigate("/login");
            }, 1200);
          } else {
            setTimeout(() => {
              navigate("/");
            }, 1200);
          }
        });
      }
      if (res && res.isLogin) {
        setTimeout(() => {
          navigate("/");
        }, 1200);
      }
    });
  }, [navigate]);
  const handleRegister = (e) => {
    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    e.preventDefault();
    UserAPI.register({ username, password })
      .then((response) => {
        if (response && response.error === "Username already exists") {
          return toast.error("Tên người dùng đã tồn tại");
        }
        if (response) {
          toast.success("Đăng ký thành công");
        }
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      })
      .catch((err) => {
        toast.error("Đăng ký thất bại");
      });
  };
  return (
    <div className="register-container">
      <div data-aos="zoom-in" data-aos-duration="800" className="register-wrap">
        <div className="register-left">
          <img
            src="https://res.cloudinary.com/dwplockls/image/upload/v1691909028/shoesStoreFullStack/Pngtree_website_design_process_illustration_concept_4188251_o6oahe.png"
            alt=""
            loading="lazy"
          />
        </div>
        <div className="register-form">
          <h4 className="text-center font-weight-bold pb-4">Đăng ký</h4>
          <form className="d-flex flex-column" onSubmit={handleRegister}>
            <div className="form-group d-flex flex-column gap-2">
              <input
                name="username"
                type="text"
                placeholder="Tên đăng nhập"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Mật khẩu"
                autoComplete=""
                required
                pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
                onInvalid={(e) => {
                  e.target.setCustomValidity(
                    "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ cái và số"
                  );
                }}
                onInput={(e) => e.target.setCustomValidity("")}
              />
            </div>
            <button className="btn-register mt-2" type="submit">
              Đăng ký
            </button>
            <div className="register-social">
              <p>Hoặc đăng nhập bằng</p>
              <div className="social-icons">
                <NavLink to="/register/facebook">
                  <img
                    src="https://res.cloudinary.com/dwplockls/image/upload/v1691904021/shoesStoreFullStack/facebook_pdicaf.svg"
                    alt="facebook"
                  />
                </NavLink>
                <NavLink to="/register/google">
                  <img
                    src="https://res.cloudinary.com/dwplockls/image/upload/v1691904021/shoesStoreFullStack/google_j5yy0v.svg"
                    alt=""
                  />
                </NavLink>
              </div>
            </div>
            <p className="text-center pt-2">
              Bạn đã có tài khoản?
              <NavLink className="register-login" to="/login">
                Đăng nhập
              </NavLink>
            </p>
          </form>
        </div>
        <div className="register-close">
          <NavLink to="/">
            <i className="fa-solid fa-xmark"></i>
          </NavLink>
        </div>
      </div>
      <ToastContainer autoClose={1400} />
    </div>
  );
};

export default RegisterPage;
