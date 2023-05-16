import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type userID = {
  value: string;
};

const initialState = {
    value: '',
    username:'',
    id: '',
} as userID;

export const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getusername: (state, action) => {
      state.username = action.payload;
    },
    getID: (state, action) => {
      state.id += action.payload;
    }
  },
});

export const { getusername, getID } = user.actions;

export default user.reducer;
