// app/redux/features/search/searchSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  searchValue: string;
  category: string;      
  subcategory: string;  
}

const initialState: SearchState = {
  searchValue: "",
  category: "",
  subcategory: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchValue(state, action: PayloadAction<string>) {
      state.searchValue = action.payload;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
    },
    setSubcategory(state, action: PayloadAction<string>) {
      state.subcategory = action.payload;
    },
  },
});

export const { setSearchValue,  setCategory, setSubcategory } = searchSlice.actions;
export default searchSlice.reducer;
