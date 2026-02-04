import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchUsers, loginUser, registerUser } from "./service";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface UserState {
  users: any[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userData: any, { rejectWithValue }) => {
    try {
      return await registerUser(userData);
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const fetchUsersThunk = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUsers();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch");
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth",
  async (userData: any, { rejectWithValue }) => {
    try {
      return await loginUser(userData);
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);




const usersSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },

    clearUsers: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        // const { user, page } = action.payload;
        // if (page === '1') {
        //   state.users = user;
        // } else {
        //   state.users = [...state.users, ...user];
        // }
        state.loading = false;
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.error = action.error.message || "Registration failed";
      })
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<any>) => {
        // state.loading = false;
        state.currentUser = action.payload.user;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        // state.loading = false;
        state.error = String(action.payload) || "Login failed";
      })
      // .addCase(logoutThunk.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(logoutThunk.fulfilled, (state) => {
      //   state.currentUser = null;
      //   state.users = [];
      //   state.loading = false;
      //   state.error = null;
      // })
      // .addCase(logoutThunk.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = String(action.payload);
      // });
  },
});

export const { logout, clearUsers } = usersSlice.actions;
export default usersSlice.reducer;
