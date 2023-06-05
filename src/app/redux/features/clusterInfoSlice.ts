import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ClusterInfo {
  ActiveOperationArn?: string;
  ClusterArn?: string;
  ClusterName?: string;
  CreationTimeString?: string | null;
  KafkaVersion?: string
  CurrentVersion?: string;
  NumberOfBrokerNodes?: number;
  State: string
}

const initialState: ClusterInfo = {
  ActiveOperationArn: '',
  ClusterArn: '',
  ClusterName: '',
  CreationTimeString: null,
  KafkaVersion: '',
  NumberOfBrokerNodes: 0,
  State: ''
};

const clusterInfoSlice = createSlice({
  name: 'clusterInfo',
  initialState: initialState,
  reducers: {
    updateClusterInfo: (
      state,
      action: PayloadAction<ClusterInfo>
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { updateClusterInfo } = clusterInfoSlice.actions;
export default clusterInfoSlice.reducer;
