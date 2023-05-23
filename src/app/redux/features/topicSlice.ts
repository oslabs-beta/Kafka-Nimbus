import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState = {
  id: '',
  Endpoint: '',
  Count: 0,
  Name: "",
  numPartitions: 0,
  replicationFactor: 1,
}

export const topic = createSlice({
  name: 'topic',
  initialState,
  reducers: {
    settopicID: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    settopicEndpoint: (state, action: PayloadAction<string>) => {
      state.Endpoint = action.payload;
    },
    settopicName: (state, action: PayloadAction<string>) => {
      state.Name = action.payload;
    },
    settopicCount: (state, action: PayloadAction<number>) => {
      state.Count = action.payload;
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
