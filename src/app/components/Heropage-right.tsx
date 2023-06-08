"use client";

import Testvideo from "./InfoVideo";


const Heroright = () => {
  return (
    <>
    <div className="hero z-0 min-h-10">
    <div className="hero-content flex-col lg:flex-row text-right">
      <Testvideo />
      <div>
        <h1 className="text-5xl font-bold">
        Manage and View Advanced Metrics
        </h1>
        <p className="py-6">
        Monitor real-time health status of brokers by navigating through easy to use menu to view comprehensive cluster metadata to optimize cluster management.

        </p>
      </div>
    </div>
  </div>
  </>
  );
};

export default Heroright;
