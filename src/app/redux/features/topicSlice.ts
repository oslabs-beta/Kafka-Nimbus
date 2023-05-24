import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type topicType = {
  payload: { name: string; partitions: object[] };
};

// when we fetch topic data that returns as an array we have to iterate through the array and push each object into state
export const topic = createSlice({
  name: 'topic',
  initialState: [],
  reducers: {
    addTopic: (state, action: topicType) => {
      state.push(action.payload);
    },
  },
});

export const { addTopic } = topic.actions;

export default topic.reducer;
