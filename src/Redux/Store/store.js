import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Slices/Slice";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
