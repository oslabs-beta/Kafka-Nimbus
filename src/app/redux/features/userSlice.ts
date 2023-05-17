"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type userID = {
  value: string;
};

const initialState = {
  value: "",
  username: "",
} as userID;

export const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    getusername: (state, action) => {
      state.username = action.payload;
    },
  },
});

export const { getusername } = user.actions;

export default user.reducer;
