"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AuthShowcase } from "./AuthShowcase";
import { useSession } from "next-auth/react";


const Heroleft = () => {
  const { data: sessionData } = useSession();
  return (


<div className="hero min-h-screen bg-base-200">
  <div className="hero-content flex-col lg:flex-row-reverse">
    <img src="/lock.svg" className="max-w-sm rounded-lg shadow-2xl" />
    <div>
      <motion.div
        className="z-2 flex flex-row"
      >
        <div className=" hero flex flex-col items-center justify-center py-16">
          <div className="hero-content flex w-full max-w-md flex-col items-center align-middle">
            <h1 className="mt-20 text-center text-6xl font-bold">
              Kafka Nimbus
            </h1>

            <p className="py-6 text-center text-2xl">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, 
            </p>
            <div className=" flex gap-4">
              <Link href="https://github.com/oslabs-beta/Kafka-Nimbus/blob/dev/README.md">
                <motion.button
                  className="btn-primary btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.8 }}
                >
                  Read our Docs{" "}
                </motion.button>
              </Link>
              {<AuthShowcase />}
            </div>
            <div>
              {sessionData ? (
                <Link href="/cluster-dashboard" className="mx-8 font-bold">
                  <motion.button
                    className="btn-light-grey btn-primary btn"
                    style={{ color: "white" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.8 }}
                  >
                    Go To Clusters
                  </motion.button>
                </Link>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</div>




    // <>
    //   <motion.div
    //     className="z-2 flex flex-row"
    //   >
    //     <div className=" hero flex flex-col items-center justify-center py-16">
    //       <div className="hero-content flex w-full max-w-md flex-col items-center align-middle">
    //         <h1 className="mt-20 text-center text-6xl font-bold">
    //           Kafka Nimbus
    //         </h1>

    //         <p className="py-6 text-center text-2xl">
    //         Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, 
    //         </p>
    //         <div className=" flex gap-4">
    //           <Link href="https://github.com/oslabs-beta/Kafka-Nimbus/blob/dev/README.md">
    //             <motion.button
    //               className="btn-primary btn"
    //               whileHover={{ scale: 1.05 }}
    //               whileTap={{ scale: 0.8 }}
    //             >
    //               Read our Docs{" "}
    //             </motion.button>
    //           </Link>
    //           {<AuthShowcase />}
    //         </div>
    //         <div>
    //           {sessionData ? (
    //             <Link href="/cluster-dashboard" className="mx-8 font-bold">
    //               <motion.button
    //                 className="btn-light-grey btn-primary btn"
    //                 style={{ color: "white" }}
    //                 whileHover={{ scale: 1.05 }}
    //                 whileTap={{ scale: 0.8 }}
    //               >
    //                 Go To Clusters
    //               </motion.button>
    //             </Link>
    //           ) : (
    //             <div></div>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   </motion.div>
    // </>
  );
};

export default Heroleft
