"use client";
import { type NextPage } from "next";
import Link from "next/link";
import { AuthShowcase } from "./components/AuthShowcase";
import { api } from "~/trpc/api";
import Demovideo from "./components/Demovideo";

const Home: NextPage = () => {
  return (
    <>
      <main className="z-50 flex flex-row">
        <div className=" hero flex flex-col items-center justify-center py-16">
          <div className="hero-content flex w-full max-w-md flex-col items-center align-middle">
            <h1 className="text-center text-6xl font-bold">
              Deploy Kafka Clusters to the Cloud
            </h1>
            <p className="py-6 text-center text-2xl">
              All in one solution for managing and deploying your clusters to
              the cloud
            </p>
            <div className=" flex gap-4">
              <Link href="https://github.com/Kafka-Nimbus/Kafka-Nimbus-GUI/blob/main/README.md">
                <button className="btn-primary btn ">Get Started</button>
              </Link>
              <AuthShowcase />
            </div>
          </div>
        </div>
      </main>


      <div className="hero min-h-screen bg-base-200 z-0">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <Demovideo />
          <div>
            <h1 className="text-5xl font-bold">
              Create a Kafka cluster now
            </h1>
            <p className="py-6">
              Our intuitive design abstracts the difficuly when creating and managing your clusters on the cloud. 
            </p>
            <Link href="/cluster-dashboard" className="font-bold mx-8">
              <button className="btn-primary btn ">Get Started</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default api.withTRPC(Home);
