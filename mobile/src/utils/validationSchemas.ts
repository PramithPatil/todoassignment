import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().email('Valid email is required').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export const registerSchema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Valid email is required').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

export const taskSchema = yup.object({
  title: yup.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters').required('Title is required'),
  description: yup.string().max(500, 'Description cannot exceed 500 characters').default(''),
  dueDateTime: yup.date().required('Due date and time is required'),
  priority: yup.string().oneOf(['Low', 'Medium', 'High']).required('Priority is required'),
});
