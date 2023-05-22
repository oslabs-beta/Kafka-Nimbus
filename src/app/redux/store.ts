"use client";

import { configureStore } from "@reduxjs/toolkit";
import brokerReducer from './features/brokerSlice'
import topicReducer from './features/topicSlice'
import consumerReducer from './features/consumerSlice'
import createClusterReducer from "./features/createClusterSlice";
import consumerGroupReducer from './features/consumerGroupSlice'

export const store = configureStore({
  reducer: {
    brokers: brokerReducer,
    topics: topicReducer,
    consumers: consumerReducer,
    consumerGroup: consumerGroupReducer,
    createCluster: createClusterReducer
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
