import axios from "axios"

const base_url="http://localhost:8080/api/v1"
const axiosInstance=axios.create();
axiosInstance.defaults.baseURL=base_url;
axiosInstance.defaults.withCredentials=true;

export default axiosInstance;