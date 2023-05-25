"use client";

import { configureStore } from "@reduxjs/toolkit";
import topicReducer from './features/topicSlice'
import clusterInfoSlice from './features/clusterInfoSlice'
import createClusterReducer from "./features/createClusterSlice";

export const store = configureStore({
  reducer: {
    topics: topicReducer,
    clusterInfo: clusterInfoSlice,
    createCluster: createClusterReducer
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
