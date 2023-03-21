import jwtDecode from 'jwt-decode';
import { UserAuth } from '../types/user-auth.type';
import { refreshTokens } from './auth.service';
import { getAccessToken, getRefreshToken, saveTokens } from './token-storage.service';

type UserPayload = {
  sub: number;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

const getUserPayload = (): UserPayload | null => {
  const accessToken = getAccessToken();
  return accessToken ? jwtDecode<UserPayload>(accessToken) : null;
}

export const getAuthUser = (): UserAuth | null => {
  const userPayload = getUserPayload();
  let user = null;
  if (userPayload && isAuth()) {
    user = {
      ...userPayload,
      id: userPayload.sub
    } as UserAuth;
  }
  return user;
}

export const isAuth = (): boolean => {
  const userPayload = getUserPayload();
  if (!userPayload) return false;
  const exp = userPayload.exp * 1000;
  const now = new Date().getTime();
  return exp > now;
}

export const updateTokens = async () => {
  const refreshToken = getRefreshToken();
  const response = await refreshTokens(refreshToken!);
  saveTokens(response.data);
}
