import axiosInstance from './axiosInstance';
import { Task, TaskFormData } from '../types';

export const fetchTasks = async (params?: { status?: string; priority?: string; sort?: string }): Promise<{ tasks: Task[] }> => {
  const response = await axiosInstance.get('/tasks', { params });
  return response.data;
};

export const createTask = async (data: TaskFormData): Promise<{ task: Task }> => {
  const payload = {
    ...data,
    dueDateTime: data.dueDateTime.toISOString(),
  };
  const response = await axiosInstance.post('/tasks', payload);
  return response.data;
};

export const updateTask = async (
  id: string,
  data: Partial<Omit<Task, 'dueDateTime'>> & { dueDateTime?: string | Date }
): Promise<{ task: Task }> => {
  const payload = {
    ...data,
    dueDateTime: data.dueDateTime instanceof Date ? data.dueDateTime.toISOString() : data.dueDateTime,
  };
  const response = await axiosInstance.put(`/tasks/${id}`, payload);
  return response.data;
};

export const toggleTask = async (id: string): Promise<{ task: Task }> => {
  const response = await axiosInstance.patch(`/tasks/${id}/toggle`);
  return response.data;
};

export const deleteTask = async (id: string): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(`/tasks/${id}`);
  return response.data;
};
