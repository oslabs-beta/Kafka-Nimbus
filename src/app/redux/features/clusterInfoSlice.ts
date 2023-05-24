import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ClusterInfo {
  ActiveOperationArn?: string;
  BrokerNodeGroupInfo?: object;
  ClusterArn?: string;
  ClusterName?: string;
  CreationTime?: Date | null;
  CurrentBrokerSoftwareInfo?: object;
  CurrentVersion?: string;
  NumberOfBrokerNodes?: number;
}

interface ClusterInfoState {
  clusterInfo: ClusterInfo;
}

const initialState: ClusterInfo = {
  ActiveOperationArn: '',
  BrokerNodeGroupInfo: {},
  ClusterArn: '',
  ClusterName: '',
  CreationTime: null,
  CurrentBrokerSoftwareInfo: {},
  CurrentVersion: '',
  NumberOfBrokerNodes: 0,
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
