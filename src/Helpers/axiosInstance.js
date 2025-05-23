import axios from "axios"

const base_url = "https://blog-app-backend-4c65.onrender.com";
const axiosInstance=axios.create();
axiosInstance.defaults.baseURL=base_url;
axiosInstance.defaults.withCredentials=true;

export default axiosInstance;