import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  brokerid: '',
  brokerAddress: '',
  brokerSize: '',
  brokerLeader: ''
}

export const broker = createSlice({
  name: 'broker',
  initialState,
  reducers: {
    setbrokerID: (state, action: PayloadAction<string>) => {
      state.brokerid = action.payload;
    },
    setbrokerAddress: (state, action: PayloadAction<string>) => {
      state.brokerAddress = action.payload;
    },
    setbrokerSize: (state, action: PayloadAction<string>) => {
      state.brokerSize = action.payload;
    },
    setbrokerLeader: (state, action: PayloadAction<string>) => {
      state.brokerLeader = action.payload;
    },
  },
});

export const { setbrokerID, setbrokerAddress, setbrokerSize, setbrokerLeader } = broker.actions;

export default broker.reducer;
