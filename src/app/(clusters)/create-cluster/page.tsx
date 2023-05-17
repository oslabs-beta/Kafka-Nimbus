"use client";
import React, { useState } from "react";
import CloudProvider from "../(components)/CloudProvider";
import AwsSecrets from "../(components)/AwsSecrets";
import RegionInput from "../(components)/RegionInput";
import ClusterNameInput from "../(components)/ClusterNameInput";
import BrokerCountInput from "../(components)/BrokerCounterInput";

type ComponentState = {
  inFocus: string
}

const CreateClusterPage = () => {
  const [inFocus, setInFocus] = useState<ComponentState['inFocus']>("provider");

  const inFocusHandler = (string: string) => {
    setInFocus(string)
  }

  switch (inFocus) {
    case "provider":
      return <CloudProvider inFocusHandler={inFocusHandler}/>;
    case "aws":
      return <AwsSecrets inFocusHandler={inFocusHandler}/>;
    case "region":
      return <RegionInput inFocusHandler={inFocusHandler}/>
    case "name":
      return <ClusterNameInput inFocusHandler={inFocusHandler}/>
    case "brokers":
      return <BrokerCountInput inFocusHandler={inFocusHandler}/>
  }
};

export default CreateClusterPage;
