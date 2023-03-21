import { AxiosInstance } from 'axios';
import { getAccessToken } from '../services/token-storage.service';
import { AUTHORIZATION_HEADER, TOKEN_PREFIX } from '../utils/constant';

export const addRequestInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    config => {
      const accessToken = getAccessToken();
      if (accessToken) {
        config.headers[AUTHORIZATION_HEADER] = TOKEN_PREFIX + accessToken;
      }
      return config;
    },
    error => {
      return Promise.reject(error)
    }
  );
}
