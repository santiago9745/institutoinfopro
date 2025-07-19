import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.REACT_APP_API_URL;
axios.defaults.baseURL = API_URL;

class HttpService {
  _axios = axios.create();

  constructor() {
    this._axios.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("access_token");
    if (token && token !== "null") {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      delete config.headers["Authorization"];
    }
    return config;
  });

    this._axios.interceptors.response.use(
  response => response,
  (error) => {
    console.log("Interceptor response error:", error);

    if (error.response) {
      console.log("Status HTTP:", error.response.status);

      if (error.response.status === 401) {
        alert("No autorizado. Por favor inicia sesión nuevamente.");
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        window.location.href = "/auth/login";
        return Promise.reject(error);
      }
    } else {
      console.log("No hay respuesta del servidor o error de red");
    }

    return Promise.reject(error);
  }
);

  }

  addRequestInterceptor = (onFulfilled, onRejected) => {
    this._axios.interceptors.request.use(onFulfilled, onRejected);
  };

  addResponseInterceptor = (onFulfilled, onRejected) => {
    this._axios.interceptors.response.use(onFulfilled, onRejected);
  };

  get = async (url) => await this.request(this.getOptionsConfig("get", url));

  post = async (url, data) => await this.request(this.getOptionsConfig("post", url, data));

  put = async (url, data) => await this.request(this.getOptionsConfig("put", url, data));

  patch = async (url, data) => await this.request(this.getOptionsConfig("patch", url, data));

  delete = async (url) => await this.request(this.getOptionsConfig("delete", url));

  getOptionsConfig = (method, url, data) => {
    return { method, url, data, headers: { 'Content-Type': 'application/vnd.api+json' } };
  };

  request(options) {
    return new Promise((resolve, reject) => {
      this._axios
        .request(options)
        .then((res) => resolve(res.data))
        .catch((ex) => reject(ex.response?.data || ex));
    });
  }
}

export default new HttpService();
