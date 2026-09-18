export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  user: string;
  title: string;
  description: string;
  dueDateTime: string; // ISO string
  priority: 'Low' | 'Medium' | 'High';
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export type Priority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'pending' | 'completed';
export type StatusFilter = 'all' | 'pending' | 'completed';
export type PriorityFilter = 'all' | 'Low' | 'Medium' | 'High';

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  statusFilter: StatusFilter;
  priorityFilter: PriorityFilter;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDateTime: Date;
  priority: Priority;
}
