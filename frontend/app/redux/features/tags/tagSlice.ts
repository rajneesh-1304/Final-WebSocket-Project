import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTagsAPI, Tag } from './tagService';

interface TagsState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

const initialState: TagsState = {
  tags: [],
  loading: false,
  error: null,
};

export const fetchTagsThunk = createAsyncThunk(
  'tags/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTagsAPI();
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch tags');
    }
  }
);

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    clearTags: (state) => {
      state.tags = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTagsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTagsThunk.fulfilled, (state, action) => {
        state.tags = action.payload;
        state.loading = false;
      })
      .addCase(fetchTagsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload);
      });
  },
});

export const { clearTags } = tagsSlice.actions;
export default tagsSlice.reducer;
