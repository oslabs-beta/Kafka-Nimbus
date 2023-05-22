import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState = {
  topicid: '',
  topicEndpoint: '',
  topicCount: 0,
  topicName: "",
  numPartitions: 0,
  replicationFactor: 1,
}

export const topic = createSlice({
  name: 'topic',
  initialState,
  reducers: {
    settopicID: (state, action: PayloadAction<string>) => {
      state.topicid = action.payload;
    },
    settopicEndpoint: (state, action: PayloadAction<string>) => {
      state.topicEndpoint = action.payload;
    },
    settopicName: (state, action: PayloadAction<string>) => {
      state.topicName = action.payload;
    },
    settopicCount: (state, action: PayloadAction<number>) => {
      state.topicCount = action.payload;
    },
    settopicPartitions: (state, action: PayloadAction<number>) => {
      state.numPartitions = action.payload;
    },
    settopicReplications: (state, action: PayloadAction<number>) => {
      state.replicationFactor = action.payload;
    },
  },
});

export const { settopicID, settopicEndpoint, settopicName, settopicCount, settopicPartitions, settopicReplications } = topic.actions;

export default topic.reducer;
