import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL || "http://localhost:8080",
  withCredentials: true,
  headers: {
    "X-Custom-Header": "thevinh",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});

export default instance;
