import axiosInstance from './axiosInstance';
import { LoginFormData, User } from '../types';

interface AuthResponse {
  user: User;
  token: string;
}

export const registerUser = async (data: { name: string; email: string; password: string }): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (data: LoginFormData): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/login', data);
  return response.data;
};

export const getMe = async (): Promise<{ user: User }> => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};
