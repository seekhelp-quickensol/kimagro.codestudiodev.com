// features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import instance from "../../utils/axiosInstance";

interface User {
  id: string;
  name: string;
  email: string;
  // Add other fields as needed
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  hydrated: boolean; // 👈 new
}


// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  hydrated: false, // 👈 added hydrated property
};


// Thunks
export const adminLogin = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/adminLogin", async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await instance.post("/auth/login", { email, password });
    return res.data.data.user as User;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const fetchSession = createAsyncThunk<
  User,
  void,
  { rejectValue: null }
>("auth/fetchSession", async (_, { rejectWithValue }) => {
  try {
    const res = await instance.get("/auth/me");
    return res.data.data.user as User;
  } catch {
    return rejectWithValue(null);
  }
});

export const adminLogOut = createAsyncThunk<null>("auth/logout", async () => {
  await instance.post("/auth/logout");
  return null;
});

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      })

      .addCase(adminLogOut.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
  
      })

      .addCase(fetchSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSession.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchSession.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setAuthenticated, clearError, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;