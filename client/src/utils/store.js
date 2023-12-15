import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import userSlice from "./userSlice";
import adminSlice from "./adminSlice";
import alertSlice from "./alertSlice";

const rootReducer = combineReducers({
  user: userSlice.reducer,
  admin: adminSlice.reducer,
  alerts: alertSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
