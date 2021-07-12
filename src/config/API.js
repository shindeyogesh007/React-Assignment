import axios from "axios";
import { Redirect } from "react-router-dom";

const ServerInstance = axios.create({
  baseURL:
    "https://php7.benchmarkit.solutions/thejoycatchersbackend/qa/api/v1/auth/token",
});

ServerInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access-token");
  if (token) {
    config.headers.authorization = token;
  }
  return config;
});

ServerInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      originalRequest.url ===
        "https://php7.benchmarkit.solutions/thejoycatchersbackend/qa/api/v1/auth/token"
    ) {
      alert("You need to login");
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = JSON.parse(
        localStorage.getItem("userData")
      ).refresh_token;
      return axios
        .post(
          "https://php7.benchmarkit.solutions/thejoycatchersbackend/qa/api/v1/auth/token",
          {
            client_id: "bitsclient",
            client_secret: "bitspass",
            grant_type: "refresh_token",
            application: "portal",
            refresh_token: refreshToken,
          }
        )
        .then((res) => {
          if (res.status === 201) {
            localStorage.setItem("userData", {
              refresh_token: res.data.refresh_token,
            });
            axios.defaults.headers.common[
              "Authorization"
            ] = `${res.data.refresh_token}`;
            return axios(originalRequest);
          }
        });
    }
    return Promise.reject(error);
  }
);

export default ServerInstance;
