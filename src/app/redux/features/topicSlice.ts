import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState = {
  topicid: '',
  topicEndpoint: '',
  topicCount: 0,
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
    settopicCount: (state, action: PayloadAction<number>) => {
      state.topicCount = action.payload;
    },
  },
});

export const { settopicID, settopicEndpoint, settopicCount } = topic.actions;

export default topic.reducer;
