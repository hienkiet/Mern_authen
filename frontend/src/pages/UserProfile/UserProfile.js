import React, { useState, useEffect, useCallback } from "react";
import UserAPI from "../../api/userAPI";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const response = await UserAPI.getProfile();
      if (response === undefined) {
        return;
      }

      if (response && response.error === "Malformed access token") {
        navigate("/login");
      }
      if (response && response?.error === "Invalid access token") {
        navigate("/");
      }

      if (response && response.error === "Access token expired") {
        const refreshResponse = await UserAPI.refreshToken();
        if (
          (refreshResponse &&
            refreshResponse.error === "Refresh token expired") ||
          refreshResponse.error === "Don't have refresh token"
        ) {
          setTimeout(() => {
            navigate("/login");
          }, 1200);
        } else {
          const refreshedResponse = await UserAPI.getProfile();
          setData(refreshedResponse);
        }
      } else {
        setData(response);
      }
    } catch (error) {
      console.error(error);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <h1>User Profile</h1>
      {data && (
        <div>
          <p>Username: {data.username}</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
