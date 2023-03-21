import { User } from '../types/user.type';
import axiosApi from './axios.service';

const USERS_URL = import.meta.env.VITE_API_URL + 'users/';

export const getUsers = async () => {
  return await axiosApi.get<User[]>(USERS_URL);
}

export const lockUsers = async (userIds: number[]) => {
  return await axiosApi.patch(USERS_URL + 'is-lock/true', userIds);
}

export const unlockUsers = async (userIds: number[]) => {
  return await axiosApi.patch(USERS_URL + 'is-lock/false', userIds);
}

export const removeUsers = async (userIds: number[]) => {
  return await axiosApi.delete(USERS_URL, { data: userIds});
}
