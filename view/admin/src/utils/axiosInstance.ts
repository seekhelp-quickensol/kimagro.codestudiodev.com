
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
} from "axios";
import { Store } from "redux";


const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  withCredentials: true,
});

export const setupInterceptors = (store: Store): void => {
  instance.interceptors.response.use(
    (res: AxiosResponse) => res,
    async (err: AxiosError) => {
    
      if (err.response?.status === 401) {
          store.dispatch({ type: "auth/logout" });
          setTimeout(() => {
            window.location.href = "/admin";
          }, 1000);
        }
      if (err.response?.status === 403) {
        console.error("Access forbidden: You do not have permission to access this resource.");
        return Promise.reject(err);
      }

    }
  );
};

export default instance;