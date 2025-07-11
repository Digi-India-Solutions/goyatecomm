import axios from "axios";
export const serverUrl="https://api.goyattrading.shop"
// export const serverUrl="http://localhost:9000"

const axiosInstance = axios.create({
  baseURL: `${serverUrl}/api/v1`,
  withCredentials: true,  // <-- This is important to send and receive cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export function debounce(func, delay) {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
export default axiosInstance;
