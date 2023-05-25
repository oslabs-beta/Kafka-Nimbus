import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState = {
  id: '',
  Endpoint: '',
  Status: '',
  Consumer: [],
}

export const consumerGroup = createSlice({
  name: 'consumerGroup',
  initialState,
  reducers: {
    setid: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    setEndpoint: (state, action: PayloadAction<string>) => {
      state.Endpoint = action.payload;
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.Status = action.payload;
    },
    addConsumer: (state, action: PayloadAction<string>) => {
      state.Consumer.push(action.payload);
    },
  },
});

export const { setid, setEndpoint, setStatus, addConsumer } = consumerGroup.actions;

export default consumerGroup.reducer;
