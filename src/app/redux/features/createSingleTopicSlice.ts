import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface initialState {
  id: string;
  Name: string;
  numPartitions: number;
  replicationFactor: number;
}

const initialState = {
  id: "",
  Name: "",
  numPartitions: 1,
  replicationFactor: 1,
  cleanUpPolicy: "Compact",
};

export const createTopic = createSlice({
  name: "createTopic",
  initialState,
  reducers: {
    settopicID: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    settopicName: (state, action: PayloadAction<string>) => {
      state.Name = action.payload;
    },
    settopicPartitions: (state, action: PayloadAction<number>) => {
      state.numPartitions = action.payload;
    },
    settopicReplications: (state, action: PayloadAction<number>) => {
      state.replicationFactor = action.payload;
    },
  },
});


export const { settopicID, settopicName, settopicPartitions, settopicReplications } = createTopic.actions;
export default createTopic.reducer;
