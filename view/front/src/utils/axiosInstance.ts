
import axios, {
  AxiosInstance
} from "axios";


const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:3000/api/",
  
});

export default instance;