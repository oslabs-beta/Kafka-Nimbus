import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState = {
  id: '',
  Address: '',
  Size: '',
  Leader: ''
}

export const broker = createSlice({
  name: 'broker',
  initialState,
  reducers: {
    setbrokerID: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    setbrokerAddress: (state, action: PayloadAction<string>) => {
      state.Address = action.payload;
    },
    setbrokerSize: (state, action: PayloadAction<string>) => {
      state.Size = action.payload;
    },
    setbrokerLeader: (state, action: PayloadAction<string>) => {
      state.Leader = action.payload;
    },
  },
});

export const { setbrokerID, setbrokerAddress, setbrokerSize, setbrokerLeader } = broker.actions;

export default broker.reducer;
