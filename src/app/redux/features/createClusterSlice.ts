"use client";
// Import necessary dependencies

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// Define initial state
const initialState = {
  provider: "",
  awsId: "",
  awsSecret: "",
  region: "",
  clusterName: "",
  brokerNumbers: 0,
};

// Create a slice using Redux Toolkit
const configSlice = createSlice({
  name: "createCluster",
  initialState,
  reducers: {
    setProvider: (state, action: PayloadAction<string>) => {
      state.provider = action.payload;
    },
    setAwsId: (state, action: PayloadAction<string>) => {
      state.awsId = action.payload;
    },
    setAwsSecret: (state, action: PayloadAction<string>) => {
      state.awsSecret = action.payload;
    },
    setRegion: (state, action: PayloadAction<string>) => {
      state.region = action.payload;
    },
    setClusterName: (state, action: PayloadAction<string>) => {
      state.clusterName = action.payload;
    },
    setBrokerNumbers: (state, action: PayloadAction<number>) => {
      state.brokerNumbers = action.payload;
    },
  },
});

// Export actions and reducer
export const {
  setProvider,
  setAwsId,
  setAwsSecret,
  setRegion,
  setClusterName,
  setBrokerNumbers,
} = configSlice.actions;

export default configSlice.reducer;