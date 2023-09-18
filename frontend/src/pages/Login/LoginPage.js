import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserAPI from "../../api/userAPI";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    UserAPI.checkLogin().then((res) => {
      if (res && res.error === "Access token expired") {
        UserAPI.refreshToken().then((res) => {
          if (
            (res && res.error === "Refresh token expired") ||
            res.error === "Don't have refresh token"
          ) {
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
          navigate(-1);
        }, 1200);
      }
    });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const username = document.querySelector("input[name='username']").value;
    const password = document.querySelector("input[name='password']").value;

    try {
      await UserAPI.login({ username, password })
        .then((res) => {
          if (res && res.message === "Login successfully") {
            toast.success("Đăng nhập thành công");
            localStorage.setItem("ptvactk", res.accessToken);
            setTimeout(() => {
              navigate("/upload");
            }, 1200);
          } else if (res && res.error === "Username does not exist") {
            toast.error("Tài khoản không tồn tại");
          } else if (res && res.error === "Password is incorrect") {
            toast.error("Mật khẩu không đúng");
          }
        })
        .catch((err) => {
          toast.error("Tài khoản hoặc mật khẩu không đúng");
        });
    } catch (error) {
      toast.error("Lỗi server");
    }
  };

  return (
    <div className="login-container">
      <div data-aos="zoom-in" data-aos-duration="800" className="login-wrap">
        <div className="login-left">
          <img
            src="https://res.cloudinary.com/dwplockls/image/upload/v1691909028/shoesStoreFullStack/Pngtree_website_design_process_illustration_concept_4188251_o6oahe.png"
            alt=""
            loading="lazy"
          />
        </div>
        <div className="login-form">
          <h4 className="text-center font-weight-bold pb-4">Đăng nhập</h4>
          <form className="d-flex flex-column" onSubmit={handleLogin}>
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
                required
                autoComplete=""
              />
            </div>
            <NavLink
              className="forgetpass align-self-end pb-3"
              to="/forget-password"
            >
              Quên mật khẩu?
            </NavLink>
            <button className="btn-login" type="submit">
              Đăng nhập
            </button>
            <div className="login-social">
              <p>Hoặc đăng nhập bằng</p>
              <div className="social-icons">
                <NavLink to="/login/facebook">
                  <img
                    src="https://res.cloudinary.com/dwplockls/image/upload/v1691904021/shoesStoreFullStack/facebook_pdicaf.svg"
                    alt="facebook"
                  />
                </NavLink>
                <NavLink to="/login/google">
                  <img
                    src="https://res.cloudinary.com/dwplockls/image/upload/v1691904021/shoesStoreFullStack/google_j5yy0v.svg"
                    alt=""
                  />
                </NavLink>
              </div>
            </div>
            <p className="register">
              Bạn chưa có tài khoản? <NavLink to="/register">Đăng ký</NavLink>
            </p>
          </form>
        </div>

        <div className="login-close">
          <NavLink to="/">
            <i className="fa-solid fa-xmark"></i>
          </NavLink>
        </div>
      </div>
      <ToastContainer autoClose={1400} />
    </div>
  );
};

export default LoginPage;
