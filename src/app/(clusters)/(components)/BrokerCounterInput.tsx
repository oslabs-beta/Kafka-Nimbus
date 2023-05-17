"use client"
import React from "react"
import { useAppDispatch } from "~/app/redux/hooks"
import { setBrokerNumbers } from "~/app/redux/features/createClusterSlice"

interface ProviderProps {
    inFocusHandler: (string: string) => void;
  }

const BrokerCounterInput: React.FC<ProviderProps> = ({ inFocusHandler }) => {

}

export default BrokerCounterInput