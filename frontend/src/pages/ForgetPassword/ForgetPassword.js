import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import userAPI from "../../api/userAPI";
import "./ForgetPassword.css";
import Loading from "../../components/Loading/Loading";

const ForgetPassword = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    userAPI.checkLogin().then((res) => {
      if (res && res.error === "Access token expired") {
        userAPI.refreshToken().then((res) => {
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

  const [isLoading, setIsLoading] = React.useState(false);
  const handleForgetPass = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const username = document.querySelector(
      "input[name='usernameForgetPass']"
    ).value;
    const emailForgetPass = document.querySelector(
      "input[name='emailForgetPass']"
    ).value;
    if (username === "" || emailForgetPass === "") {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const res = await userAPI.forgetPassword(username, emailForgetPass);
      console.log(res);
      if (res?.message === "Send email successfully") {
        setIsLoading(false);
        toast.success("Vui lòng kiểm tra email");
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else if (res?.error === "Username does not exist") {
        toast.error("Tên đăng nhập không tồn tại");
      } else if (res?.error === "Email does not exist") {
        toast.error("Email không tồn tại");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="forget_pass-container">
      <div
        data-aos="zoom-in"
        data-aos-duration="800"
        className="forget_pass-wrap"
      >
        <div className="forget_pass-left">
          <img
            src="https://res.cloudinary.com/dwplockls/image/upload/v1691909028/shoesStoreFullStack/Pngtree_website_design_process_illustration_concept_4188251_o6oahe.png"
            alt=""
            loading="lazy"
          />
        </div>
        <div className="forget_pass-form">
          <h4 className="text-center font-weight-bold pb-4">Quên mật khẩu</h4>
          <form className="d-flex flex-column" onSubmit={handleForgetPass}>
            <div className="form-group d-flex flex-column gap-2">
              <input
                name="usernameForgetPass"
                type="text"
                placeholder="Tên đăng nhập"
                required
                onInvalid={(e) => {
                  e.target.setCustomValidity(
                    "Tên đăng nhập không được để trống"
                  );
                }}
                onInput={(e) => e.target.setCustomValidity("")}
              />
              <input
                name="emailForgetPass"
                type="email"
                placeholder="Email"
                required
                onInvalid={(e) => {
                  e.target.setCustomValidity(
                    "Email không được để trống và phải đúng định dạng"
                  );
                }}
                onInput={(e) => e.target.setCustomValidity("")}
              />
            </div>
            <button className="btn-forget_pass mt-2" type="submit">
              Xác nhận
            </button>
          </form>
        </div>
        <div className="forget_pass-close">
          <NavLink to="/">
            <i className="fa-solid fa-xmark"></i>
          </NavLink>
        </div>
      </div>
      <ToastContainer autoClose={1400} />
      {isLoading ? <Loading /> : ""}
    </div>
  );
};

export default ForgetPassword;
