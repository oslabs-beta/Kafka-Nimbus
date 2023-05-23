import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  id: '',
  Endpoint: '',
  Count: 0,
}

export const consumer = createSlice({
  name: 'consumerGroup',
  initialState,
  reducers: {
    setconsumerID: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    setconsumerEndpoint: (state, action: PayloadAction<string>) => {
      state.Endpoint = action.payload;
    },
    setconsumerCount: (state, action: PayloadAction<number>) => {
      state.Count = action.payload;
    },
  },
});

export const { setconsumerID, setconsumerEndpoint, setconsumerCount } = consumer.actions;

export default consumer.reducer;
