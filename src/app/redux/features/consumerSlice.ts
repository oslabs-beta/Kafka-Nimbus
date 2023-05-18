import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  consumerid: '',
  consumerEndpoint: '',
  consumerCount: 0,
}

export const consumer = createSlice({
  name: 'consumer',
  initialState,
  reducers: {
    setconsumerID: (state, action: PayloadAction<string>) => {
      state.consumerid = action.payload;
    },
    setconsumerEndpoint: (state, action: PayloadAction<string>) => {
      state.consumerEndpoint = action.payload;
    },
    setconsumerCount: (state, action: PayloadAction<number>) => {
      state.consumerCount = action.payload;
    },
  },
});

export const { setconsumerID, setconsumerEndpoint, setconsumerCount } = consumer.actions;

export default consumer.reducer;
