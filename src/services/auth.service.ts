import axios from 'axios';
import { LoginBody, SignupBody } from '../types/auth.type';
import { Tokens } from '../types/token.type';
import { AUTHORIZATION_HEADER, TOKEN_PREFIX } from '../utils/constant';
import axiosApi from './axios.service';

const AUTH_URL = import.meta.env.VITE_API_URL + 'auth/';

export const signup = async (data: SignupBody) => {
  return await axios.post<Tokens>(AUTH_URL + 'signup', data);
}

export const login = async (data: LoginBody) => {
  return await axios.post<Tokens>(AUTH_URL + 'login', data);
}

export const logout = async () => {
  return await axiosApi.post(AUTH_URL + 'logout');
}

export const refreshTokens = async (refreshToken: string) => {
  return await axios.post<Tokens>(AUTH_URL + 'refresh', null, {
    headers: {
      [AUTHORIZATION_HEADER]: TOKEN_PREFIX + refreshToken,
    }
  });
}
