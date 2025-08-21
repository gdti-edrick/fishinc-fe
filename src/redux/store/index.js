import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../slice/counterSlice";
import commonReducer from "../slice/commonSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    common: commonReducer,
  },
});
