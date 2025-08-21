import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loaderFetching: false,
  // lock: false,
  // routesPriviledges: [],
  // routesAuthPriviledges: [],
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setloaderFetching: (state, action) => {
      state.loaderFetching = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setloaderFetching } = commonSlice.actions;

export default commonSlice.reducer;
