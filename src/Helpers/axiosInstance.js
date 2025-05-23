import axios from "axios"

const base_url=process.env.REACT_APP_API_URL || 'http://localhost:8080';
const axiosInstance=axios.create();
axiosInstance.defaults.baseURL=base_url;
axiosInstance.defaults.withCredentials=true;

export default axiosInstance;