"use client";
import { type NextPage } from "next";
import Link from "next/link";
import { api } from "~/trpc/api";
import Demovideo from "./components/Demovideo";
import FeaturesList from "./components/Features";
import TeamList from "./components/TeamMembers";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Heroright from "./components/Herpage-right";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      {/** Background video for hero page */}
      <video
        autoPlay
        loop
        muted
        className="fixed z-0 min-h-screen w-full min-w-full object-cover"
      >
        <source
          src="https://res.cloudinary.com/dpqdqryvo/video/upload/v1685977440/AdobeStock_142908704_ch2pwb.mp4"
          type="video/mp4"
        />
      </video>


      {/* Demo Video */}
      <div className="hero z-0 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <Demovideo />
          <div>
            <h1 className="text-5xl font-bold">
            Seamlessly Deploy Your Apache Kafka Cluster to the Cloud!
            </h1>
            <p className="py-6">
            Kafka Nimbus is an easy to use web application that simplifies and automates the creation of clusters in cloud environments.

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

      <Heroright />

      {/* List of Features */}
      <div className="flex justify-center pt-60 pb-10">
        <h2 className="z-10 text-4xl font-bold">Features</h2>
      </div>
      <div className="hero">
        <FeaturesList />
      </div>

      {/* List of Team Members */}
      <div className="flex justify-center pt-60 pb-1">
        <h2 className="z-10 text-4xl font-bold">The Team</h2>
      </div>
      <div className="hero">
        <TeamList />
      </div>
    </>
  );
};

export default api.withTRPC(Home);
