import instance from "./axiosConfig";

const UserAPI = {
  // [POST] register
  register: async (props) => {
    const { username, password } = props;
    return instance
      .post(
        "/register",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        return response?.data;
      })
      .catch(function (error) {
        return error?.response?.data;
      });
  },
  // [POST] login
  login: async (props) => {
    const { username, password } = props;
    return await instance
      .post("/login", {
        username,
        password,
      })
      .then(function (response) {
        return response?.data;
      })
      .catch(function (error) {
        return error?.response?.data;
      });
  },

  // [GET] get user profile
  getProfile: async () => {
    return await instance
      .get("/me/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ptvactk")}`,
        },
      })
      .then(function (response) {
        return response?.data;
      })
      .catch(function (error) {
        return error?.response?.data;
      });
  },

  // [POST] refresh token
  refreshToken: async () => {
    return await instance
      .post("/refresh_token", {})
      .then(function (response) {
        localStorage.setItem("ptvactk", response.data.accessToken);
        return response?.data;
      })
      .catch(function (error) {
        return error?.response?.data;
      });
  },

  // [GET] check login status
  checkLogin: async () => {
    return await instance
      .get("/check_login", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ptvactk")}`,
        },
      })
      .then(function (response) {
        return response?.data;
      })
      .catch(function (error) {
        return error?.response?.data;
      });
  },

  // [POST] forget password
  forgetPassword: async (username, emailForgetPass) => {
    return await instance
      .post("/forget_password", {
        username,
        emailForgetPass,
      })
      .then(function (response) {
        return response?.data;
      })
      .catch(function (error) {
        return error?.response?.data;
      });
  },

  // [GET] logout
  logout: async () => {
    return await instance
      .get("/logout", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ptvactk")}`,
        },
      })
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        return error?.response?.data;
      });
  },

  // [GET] get admin role
  getRole: async () => {
    return await instance
      .get("/api/getRole", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ptvactk")}`,
        },
      })
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        return error?.response?.data;
      });
  },

  // [GET] get all users
  getAllUsers: async () => {
    return await instance
      .get("/api/getAllUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ptvactk")}`,
        },
      })
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        return error?.response?.data;
      });
  },

  // [POST] admin search user
  adminSearchUser: async (username) => {
    return await instance
      .get(
        `/admin/control/user/search/${username}`,
        // params
        {
          params: {
            username,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ptvactk")}`,
          },
        }
      )
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        return error?.response?.data;
      });
  },

  // [PUT] edit user
  editUser: async (props) => {
    const { userID, username, isAdmin } = props;
    return await instance
      .put(
        "/api/control/editUser",
        {
          userID,
          username,
          isAdmin,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ptvactk")}`,
          },
        }
      )
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        return error?.response?.data;
      });
  },

  // [DELETE] delete user
  deleteUser: async (props) => {
    const { userID } = props;
    return await instance
      .delete("/api/control/deleteUser", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ptvactk")}`,
        },
        data: {
          userID,
        },
      })
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        return error?.response?.data;
      });
  },
};

export default UserAPI;
