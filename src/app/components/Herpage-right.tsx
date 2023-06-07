"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Demovideo from "./Demovideo";
import Link from "next/link";



const Heroright = () => {

  const { data: sessionData } = useSession();
  return (
    <>
    <div className="hero z-0 min-h-10">
    <div className="hero-content flex-col lg:flex-row text-right">
      <Demovideo />
      <div>
        <h1 className="text-5xl font-bold">
        Manage and View Advanced Metrics
        </h1>
        <p className="py-6">
        Monitor real-time health status of brokers by navigating through easy to use menu to view comprehensive cluster metadata to optimize cluster management.

        </p>
        <Link href="/cluster-dashboard" className="mx-8 font-bold">
          <motion.button
            className="btn-primary btn "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.8 }}
          >
            Get Started
          </motion.button>
        </Link>
      </div>
    </div>
  </div>
  </>
  );
};

export default Heroright;
