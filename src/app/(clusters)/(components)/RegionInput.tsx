"use client"
import React from "react"
import { useAppDispatch } from "~/app/redux/hooks"
import { setRegion } from "~/app/redux/features/createClusterSlice"

interface ProviderProps {
    inFocusHandler: (string: string) => void;
  }

const RegionInput: React.FC<ProviderProps> = ({ inFocusHandler }) => {

}

export default RegionInput