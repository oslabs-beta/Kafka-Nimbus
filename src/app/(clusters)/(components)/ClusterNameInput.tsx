"use client"
import React from "react"
import { useAppDispatch } from "~/app/redux/hooks"
import { setClusterName } from "~/app/redux/features/createClusterSlice"

interface ProviderProps {
    inFocusHandler: (string: string) => void;
  }

const ClusterNameInput: React.FC<ProviderProps> = ({ inFocusHandler }) => {

}

export default ClusterNameInput