import { logout } from "../app/redux/features/users/userSlice";
import axios from "axios";

export const privateApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

privateApi.interceptors.response.use(
  (response) => response,
  
  (error) => {
    if (error.response?.status === 401) {
    console.log("401 detected. Value of store variable is:", store);
    if (store) {
      store.dispatch(logout());
    } else {
      console.error("Logout failed: store is still undefined.");
    }
  }
    return Promise.reject(error);
  },
);