import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ClusterInfo {
  ActiveOperationArn?: string;
  ClusterArn?: string;
  ClusterName?: string;
  CreationTime?: Date | null;
  KafkaVersion?: string
  CurrentVersion?: string;
  NumberOfBrokerNodes?: number;
  State: string
}

interface ClusterInfoState {
  clusterInfo: ClusterInfo;
}

const initialState: ClusterInfo = {
  ActiveOperationArn: '',
  ClusterArn: '',
  ClusterName: '',
  CreationTime: null,
  KafkaVersion: '',
  NumberOfBrokerNodes: 0,
  State: ''
};

const clusterInfoSlice = createSlice({
  name: 'clusterInfo',
  initialState,
  reducers: {
    updateClusterInfo: (
      state: ClusterInfoState,
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
