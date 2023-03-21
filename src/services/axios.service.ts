import axios from "axios";
import { addRequestInterceptor } from './../interceptors/request.interceptor';

const axiosApi = axios.create();
addRequestInterceptor(axiosApi);

export default axiosApi;