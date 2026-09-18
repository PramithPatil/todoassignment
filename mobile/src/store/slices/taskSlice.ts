import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskState, StatusFilter, PriorityFilter, TaskFormData } from '../../types';
import * as taskApi from '../../api/taskApi';

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
  statusFilter: 'all',
  priorityFilter: 'all',
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params: { status?: string; priority?: string; sort?: string } | undefined, { rejectWithValue }) => {
    try {
      const response = await taskApi.fetchTasks(params);
      return response.tasks;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (data: TaskFormData, { rejectWithValue }) => {
    try {
      const response = await taskApi.createTask(data);
      return response.task;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (
    { id, data }: { id: string; data: Partial<Omit<Task, 'dueDateTime'>> & { dueDateTime?: string | Date } },
    { rejectWithValue }
  ) => {
    try {
      const response = await taskApi.updateTask(id, data);
      return response.task;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleTask = createAsyncThunk(
  'tasks/toggleTask',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await taskApi.toggleTask(id);
      return response.task;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      await taskApi.deleteTask(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<StatusFilter>) => {
      state.statusFilter = action.payload;
    },
    setPriorityFilter: (state, action: PayloadAction<PriorityFilter>) => {
      state.priorityFilter = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // createTask
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      // updateTask
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // toggleTask
      .addCase(toggleTask.pending, (state, action) => {
        // Optimistic update
        const task = state.tasks.find(t => t._id === action.meta.arg);
        if (task) {
          task.status = task.status === 'completed' ? 'pending' : 'completed';
        }
      })
      .addCase(toggleTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(toggleTask.rejected, (state, action) => {
        // Revert on failure (we would ideally need the original state, but this simple revert works mostly)
        const task = state.tasks.find(t => t._id === action.meta.arg);
        if (task) {
          task.status = task.status === 'completed' ? 'pending' : 'completed';
        }
        state.error = action.payload as string;
      })
      // deleteTask
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t._id !== action.payload);
      });
  },
});

export const { setStatusFilter, setPriorityFilter, clearError } = taskSlice.actions;
export default taskSlice.reducer;
