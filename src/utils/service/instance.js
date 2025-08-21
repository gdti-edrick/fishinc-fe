import axios from "axios";
import { fetchRefreshToken } from "../../api/auth";
import { Navigate } from "react-router-dom";
// import { fetchRefreshToken } from "api/auth";

const POST_URL = import.meta.env.VITE_BACKEND_URL;

const instance = axios.create({
  baseURL: `${POST_URL}`,
  headers: {
    SIGNATURE: "#",
    SECRET: import.meta.env.VITE_SECRET,
    ipaddress: "1.1.1.2",
  },
});

// let request_start_at = window.performance.now();

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("ERROR INSTANCE ==> ", error.response?.status);
      window.location.href = "/logout?isLogin=expired";
      return Promise.reject(error);
    }
    // if (error.response.data.code === "SESSION_EXPIRED") {
    //   const newToken = await fetchRefreshToken();
    //   if (newToken) {
    //     console.log("ERROR INSTANCE ==> ", error);
    //     error.config.headers.Authorization = `Bearer ${newToken}`;
    //     return axios.request(error?.config);
    //   }
    // }

    return Promise.reject(error);
  }
);

export default instance;
