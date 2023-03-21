import { useUserContext } from "../context/userContext";
import { getRefreshToken } from "../services/token-storage.service";
import { updateTokens } from "../services/user-auth.service";
import { ApiRoutes, Exception } from "../utils/constant";
import axiosApi from './../services/axios.service';
import { useNavigate } from 'react-router-dom';

export const useFetch = (fetchData: () => Promise<any>) => {
  const { removeUser } = useUserContext();
  const navigate = useNavigate();

  const call = async (): Promise<any> => {
    try {
      const response = await fetchData();
      return response;
    } catch (error: any) {
      const originalRequest = error.config;
      const message = error.response.data.message;
      if (message == Exception.ACCESS_TOKEN_EXPIRATION ||
        message == Exception.ACCESS_TOKEN_INVALID) {

        if (getRefreshToken()) {
          try {
            await updateTokens();
            return await axiosApi(originalRequest);
          } catch (error) {
            removeUser();
            navigate(ApiRoutes.DEFAULT);
            throw error;
          }
        }
      } else if (message == Exception.USER_IS_LOCK) {
        removeUser();
        navigate(ApiRoutes.DEFAULT);
      }
      throw error;
    }
  };

  return [call];
};
