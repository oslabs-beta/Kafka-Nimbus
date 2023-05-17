'use client'

import { type NextPage } from "next";
import Link from "next/link";
import { type Metadata } from 'next';
import { AuthShowcase } from "./components/AuthShowcase";
import { api } from "~/utils/api";
import { withTRPC } from '@trpc/next';
import { appRouter } from '../server/api/root';
import { SessionProvider } from "next-auth/react";


const Home: NextPage = () => {
  
  return (
    <>
      <main className="hero min-h-screen w-full bg-base-200">
        
        <div className="container flex flex-col align-middle justify-center py-16 ">

         <div className=' flex flex-col align-middle max-w-md justify-center'>
           <h1 className='text-5xl font-bold'>Deploy Kafka Clusters to the Cloud</h1>
           <p className = 'py-6'>All in one solution for managing and deploying your clusters to the cloud</p>
           <Link href="https://github.com/Kafka-Nimbus/Kafka-Nimbus-GUI/blob/main/README.md">
            <button className='btn btn-primary bg-gradient-to-b from-[#2e026d] to-[#15162c]'>Get Started</button>
            </Link>
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {/* {hello.data ? hello.data.greeting : "Loading tRPC query..."} */}
            </p>
            <AuthShowcase />
          </div>

        </div>
      </main>
    </>
  );
};

// export default Home;
export default api.withTRPC(Home);
