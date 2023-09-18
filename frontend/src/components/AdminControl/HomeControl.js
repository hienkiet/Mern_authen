import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserAPI from "../../api/userAPI";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

const HomeControl = () => {
  const navigate = useNavigate();
  const handleAdminPage = useCallback(async () => {
    return await UserAPI.getRole().then((res) => {
      if (res && res.error === "Access token expired") {
        UserAPI.refreshToken();
        UserAPI.getRole().then((res) => {
          if (res && !res.isAdmin) {
            navigate(-1);
          }
        });
      }
      if (res && res.error === "Malformed access token") {
        navigate("/login");
      }
      if (res && res?.error === "Invalid access token") {
        navigate("/");
      }

      if (res && res.error === "Don't have access token") {
        navigate("/login");
      }

      if (!res.isAdmin) {
        navigate(-1);
      }
    });
  }, [navigate]);

  useEffect(() => {
    handleAdminPage();
  }, [handleAdminPage]);

  ChartJS.register(ArcElement, Tooltip, Legend);
  const data = {
    labels: ["Đã giao", "Đang giao", "Đã hủy"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 190, 30],
        backgroundColor: [
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(255, 99, 132)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Thống kê đơn hàng",
      },
    },
  };

  return (
    <div style={{ backgroundColor: "#eee" }} className="col py-3">
      <h2 className="text-center">THỐNG KÊ</h2>
      <div className="admin-statistical">
        <div className="row mt-4">
          <div className="d-flex flex-column flex-lg-row gap-3 gap-lg-5 align-items-center justify-content-lg-center">
            <div className="col-auto admin-statistical-item d-flex align-items-center justify-content-center gap-2 p-3 shadow-sm bg-light rounded w-auto">
              <i className="fa-solid fa-sack-dollar"></i>
              <h5>Doanh thu:</h5>
              <span className="text-primary fs-5">1.000.000 VND</span>
            </div>
            <div className="col-auto admin-statistical-item d-flex align-items-center justify-content-center gap-2 p-3 shadow-sm bg-light rounded w-auto">
              <i className="fa-solid fa-shop-lock"></i>
              <h5>Kho:</h5>
              <span className="text-primary fs-5">100.000 SP</span>
            </div>
            <div className="col-auto admin-statistical-item d-flex align-items-center justify-content-center gap-2 p-3 shadow-sm bg-light rounded w-auto">
              <i className="fa-solid fa-truck-fast"></i>
              <h5>Số đơn hàng:</h5>
              <span className="text-primary fs-5">100.000 SP</span>
            </div>
          </div>
        </div>
        <div className="piechart-wrap">
          <Pie className="piechart" data={data} options={options}></Pie>
        </div>
      </div>
    </div>
  );
};

export default HomeControl;
