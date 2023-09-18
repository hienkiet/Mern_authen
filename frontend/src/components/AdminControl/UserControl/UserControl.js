import React, { useCallback, useEffect, useState } from "react";
import UserAPI from "../../../api/userAPI";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserControl = () => {
  const [userAction, setUserAction] = useState({});
  const [userList, setUserList] = useState([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const navigate = useNavigate();

  const loadUserList = useCallback(async () => {
    try {
      const res = await UserAPI.getAllUsers();
      if (res && res?.error === "Access token expired") {
        await UserAPI.refreshToken();
        const refreshedRes = await UserAPI.getAllUsers();
        if (refreshedRes.length > 0) {
          setUserList(refreshedRes);
        }
      }

      if (res && res?.error === "Invalid access token") {
        navigate("/");
      }

      if (res && res?.error === "Malformed access token") {
        navigate("/");
      }
      if (res?.message === "Success" && res?.data.length > 0) {
        setUserList(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [navigate]);

  useEffect(() => {
    loadUserList();
  }, [loadUserList]);

  const handleModalEditUser = (e) => {
    e.preventDefault();
    const userID = e.target.closest("tr").dataset.userid;
    setUserAction({ action: "edit", userID: userID });
    setEditModalOpen(true);
  };

  const handleModalDeleteUser = (e) => {
    e.preventDefault();
    const userID = e.target.closest("tr").dataset.userid;
    setUserAction({ action: "delete", userID: userID });
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    navigate(0);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    const userID = userAction.userID;
    const username = document.querySelector("#username_edit").value;
    var isAdmin = document.querySelector("#isAdmin_edit").value;
    if (!username || !isAdmin) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    } else {
      isAdmin = isAdmin === "true" ? true : false;
    }
    const payload = {
      userID,
      username,
      isAdmin,
    };
    try {
      const res = await UserAPI.editUser(payload);
      if (res && res?.error === "Access token expired") {
        await UserAPI.refreshToken();
        const refreshedRes = await UserAPI.editUser(payload);
        if (refreshedRes?.message === "Edit user successfully") {
          toast.success("Chỉnh sửa thành công!");
          setTimeout(() => {
            handleCloseEditModal();
          }, 1000);
        }
      }
      if (res && res?.error === "Username already exists") {
        toast.error("Tên người dùng đã tồn tại!");
      }

      if (res && res.error === "Don't have access token") {
        navigate("/login");
      }

      if (res && res?.error === "Malformed access token") {
        navigate("/");
      }
      if (res?.message === "Edit user successfully") {
        toast.success("Chỉnh sửa người dùng thành công!");
        setTimeout(() => {
          handleCloseEditModal();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    const userID = userAction.userID;
    console.log(userID);
    const payload = {
      userID,
    };
    try {
      const res = await UserAPI.deleteUser(payload);
      if (res && res?.error === "Access token expired") {
        UserAPI.refreshToken();
        const refreshedRes = UserAPI.deleteUser(payload);
        if (refreshedRes?.message === "Delete user successfully") {
          toast.success("Xóa người dùng thành công!");
          setTimeout(() => {
            handleCloseEditModal();
          }, 1000);
        }
      }
      if (res && res?.error === "User does not exist") {
        toast.error("Người dùng không tồn tại!");
      }

      if (res && res.error === "Don't have access token") {
        navigate("/login");
      }

      if (res && res?.error === "Can't delete your account") {
        toast.error("Không thể xóa tài khoản của bạn!");
      }

      if (res && res?.error === "User is online") {
        toast.error("Không thể xóa người dùng đang online!");
      }
      if (res && res?.error === "Malformed access token") {
        navigate("/");
      }
      if (res?.message === "Delete user successfully") {
        toast.success("Xóa người dùng thành công!");
        setTimeout(() => {
          handleCloseEditModal();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchUser = async (e) => {
    e.preventDefault();
    const username = document.querySelector("input[name='searchUser']").value;
    return await UserAPI.adminSearchUser(username)
      .then((response) => {
        if (response && response?.error === "Access token expired") {
          UserAPI.refreshToken();
          const refreshedRes = UserAPI.adminSearchUser(username);
          if (refreshedRes.length > 0) {
            setUserList(refreshedRes);
          }
        }
        if (response && response?.error === "User does not exist") {
          toast.error("Người dùng không tồn tại!");
        }
        if (response && response?.error === "Invalid access token") {
          navigate("/");
        }

        if (response && response?.error === "Malformed access token") {
          navigate("/");
        }
        if (response?.message === "Success" && response?.user?.length > 0) {
          console.log("response", response);
          setUserList(response.user);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="col text-center mt-4">
      <h2>QUẢN LÝ NGƯỜI DÙNG</h2>
      <div className="admin-control-user-wrap">
        <form method="GET" className="d-flex mt-5" onSubmit={handleSearchUser}>
          <input
            name="searchUser"
            className="form-control me-1 shadow-none"
            type="text"
            placeholder="Nhập tên người dùng"
            aria-label="Search"
            required
          />
          <button className="btn btn-success" type="submit">
            Search
          </button>
        </form>
        {/* table control */}
        {userList?.length === 0 ? (
          <h4 className="mt-3">Không có người dùng nào!</h4>
        ) : (
          <div className="mt-5 w-100">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {userList?.length > 0 &&
                  userList?.map((user, index) => {
                    return (
                      <tr
                        id="userid_control"
                        data-userid={user._id}
                        key={user._id}
                      >
                        <td>{index + 1}</td>
                        <td>{user.username}</td>
                        <td>{user.isAdmin ? "Admin" : "User"}</td>
                        <td className="d-flex gap-2 align-items-center justify-content-center">
                          <button
                            type="button"
                            className="btn btn-warning d-flex gap-2 align-items-center justify-content-center"
                            data-bs-toggle="modal"
                            data-bs-target="#editUserModal"
                            onClick={handleModalEditUser}
                          >
                            <i className="fas fa-edit"></i>
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger d-flex gap-2 align-items-center justify-content-center"
                            data-bs-toggle="modal"
                            data-bs-target="#editUserModal"
                            onClick={handleModalDeleteUser}
                          >
                            <i className="fas fa-trash-alt"></i>
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Edit User Modal */}
      <div
        className={`modal fade ${isEditModalOpen ? "show" : ""}`}
        id="editUserModal"
        tabIndex="-1"
        aria-labelledby="editUserModalLabel"
        aria-hidden={!isEditModalOpen}
        style={{ display: `${isEditModalOpen ? "block" : "none"}` }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editUserModalLabel">
                {userAction.action === "edit"
                  ? "Chỉnh sửa người dùng"
                  : "Xóa người dùng"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {userAction.action === "edit" ? (
                <form>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="username_edit"
                      defaultValue={userAction.username}
                      placeholder="Username"
                    />
                  </div>
                  <div className="mb-3">
                    <select
                      className="form-select"
                      id="isAdmin_edit"
                      defaultValue={userAction.isAdmin}
                    >
                      <option value="">--- Role ---</option>
                      <option value="true">Admin</option>
                      <option value="false">User</option>
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleEditUser}
                    >
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <h5 className="text-danger">
                    Bạn có chắc chắn muốn xóa người dùng này?
                  </h5>
                  <div className="d-flex gap-2 align-items-center justify-content-center mt-3">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleDeleteUser}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={1200} />
    </div>
  );
};

export default UserControl;
