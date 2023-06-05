"use client";
import { type NextPage } from "next";
import Link from "next/link";
import { AuthShowcase } from "./components/AuthShowcase";
import { api } from "~/trpc/api";
import Demovideo from "./components/Demovideo";
import FeaturesList from "./components/Features";
import TeamList from "./components/TeamMembers";
import { motion } from "framer-motion";

const Home: NextPage = () => {
  return (
    <>
      <video
        autoPlay
        loop
        muted
        className="fixed z-0 min-h-screen w-full min-w-full object-cover"
      >
        <source src="https://res.cloudinary.com/dpqdqryvo/video/upload/v1685977440/AdobeStock_142908704_ch2pwb.mp4" type="video/mp4" />
      </video>
      <motion.div
        className="z-2 flex flex-row"
        initial={{ scale: 0.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1}}
      >
        <div className=" hero flex flex-col items-center justify-center py-16">
          <div className="hero-content flex w-full max-w-md flex-col items-center align-middle">
            <h1 className="mt-20 text-center text-6xl font-bold">
              Deploy your Clusters with Kafka Nimbus
            </h1>

            <p className="py-6 text-center text-2xl">
              All in one solution for managing and deploying your clusters to
              the cloud
            </p>
            <div className=" flex gap-4">
              <Link href="https://github.com/Kafka-Nimbus/Kafka-Nimbus-GUI/blob/main/README.md">
                <button className="btn-primary btn ">Read our Docs </button>
              </Link>
              {<AuthShowcase />}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Demo Video */}
      <div className="hero z-0 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <Demovideo />
          <div>
            <h1 className="text-5xl font-bold">
              Create your own Kafka Cluster
            </h1>
            <p className="py-6">
              Our intuitive design abstracts the difficuly when setting up and
              managing your clusters on the cloud.
            </p>
            <Link href="/cluster-dashboard" className="mx-8 font-bold">
              <button className="btn-primary btn ">Get Started</button>
            </Link>
          </div>
        </div>
      </div>

      {/* List of Features */}
      <div className="flex justify-center">
        <h2 className="z-10 text-4xl font-bold">Features</h2>
      </div>
      <div className="hero min-h-screen">
        <FeaturesList />
      </div>

      {/* List of Team Members */}
      <div className="flex justify-center pt-60">
        <h2 className="z-10 text-4xl font-bold">The Team</h2>
      </div>
      <div className="hero min-h-screen">
        <TeamList />
      </div>
    </>
  );
};

export default api.withTRPC(Home);
