"use client";

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import createClusterReducer from "./features/createClusterSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    createCluster: createClusterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
