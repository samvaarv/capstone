import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.mode === "development" ? "http://localhost:8888/api" : "/api",
	withCredentials: true, // send cookies to the server
});

export default axiosInstance;