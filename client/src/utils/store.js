import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import userSlice from "./userSlice";
import adminSlice from "./adminSlice";
import themeSlice from "./themeSlice";
import alertSlice from "./alertSlice";

const rootReducer = combineReducers({
  user: userSlice.reducer,
  admin: adminSlice.reducer,
  theme: themeSlice.reducer,
  alerts: alertSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
