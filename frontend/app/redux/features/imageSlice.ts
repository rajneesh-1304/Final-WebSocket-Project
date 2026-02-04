import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
const BASE_URL = process.env.BASE_URL;

export const fetchImagesThunk = createAsyncThunk(
  'image/fetchImages',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/image`);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch images');
    }
  }
);

const imageSlice = createSlice({
  name: 'image',
  initialState: {
    images: [],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImagesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(fetchImagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default imageSlice.reducer;
