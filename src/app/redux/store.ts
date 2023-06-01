"use client";

import { configureStore } from "@reduxjs/toolkit";
import topicReducer from './features/createTopicSlice'
import clusterInfoSlice from './features/clusterInfoSlice'
import createClusterReducer from "./features/createClusterSlice";
import consumerGroupReducer from './features/clusterInfoSlice'
import createSingleTopicSlice from "./features/createSingleTopicSlice";

export const store = configureStore({
  reducer: {
    topics: topicReducer,
    clusterInfo: clusterInfoSlice,
    createCluster: createClusterReducer,
    consumerGroup: consumerGroupReducer,
    createTopic: createSingleTopicSlice,
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
