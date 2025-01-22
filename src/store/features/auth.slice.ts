import { axiosInstance } from '@/lib/axios';
import { LoginFormValues } from '@/types/auth';
import { LoginUserInitialData, User } from '@/types/user';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  exp: number | null;
  settings: {
    notifications: {
      email: boolean;
      system: boolean;
    };
  };
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  error: null,
  exp: null,
  settings: {
    notifications: {
      email: false,
      system: false,
    },
  },
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData: LoginFormValues, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/auth/login`,
        {
          ...loginData,
        },
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || 'Login failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

// Async thunk for logout
export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await axiosInstance.post('/auth/logout');
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      // Login pending
      .addCase(loginUser.pending, (state) => {
        state.error = null;
      })
      // Login fulfilled
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginUserInitialData>) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
        state.exp = action.payload.exp;
      })

      // Login rejected
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.exp = null;
      })
      // Logout fulfilled
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
        state.exp = null;
      });
  },
});

export const AuthActions = authSlice.actions;
export default authSlice.reducer;
