import { createSlice, PayloadAction } from '@reduxjs/toolkit';


// individual topics
interface TopicType {
  name: string,
  numPartitions: number,
  replicationFactor: number,
  partitions: object[],
}

// array of topics
interface TopicState {
  topicList: TopicType[];
}

// initial state initialized to an empty array
const initialState: TopicState = {
  topicList: [],
};

export const topicSlice = createSlice({
  name: 'topic',
  initialState,
  reducers: {
    addTopic: (state, action: PayloadAction<TopicType>) => {
      state.topicList.push(action.payload);
    },
  },
});

export const { addTopic } = topicSlice.actions;

export default topicSlice.reducer;
