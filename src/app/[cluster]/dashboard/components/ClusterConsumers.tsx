"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ClusterConsumers = ({ consumers }) => {
  const router = useRouter()
  // modals initially set to -1 because it is  keepting track of which specific member
  // you are clicking on, so that it can use that data
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(-1);
  const [isTopicsModalOpen, setIsTopicsModalOpen] = useState(-1);

  return (
    <>
      {/* Modal for members array */}
      {/* will show modal with consumers of specific consumer group*/}
      {isMembersModalOpen >= 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
          <div className="max-w-md rounded-lg bg-white p-6">
            <h3 className="text-center text-lg font-bold">Members</h3>
            <p className="py-4"></p>
            {/* Creates new div for each member in members array */}
            <div className="left-0 top-0 float-left">
              {consumers[isMembersModalOpen].members.map((member, index) => (
                <div key={index}>{member}</div>
              ))}
            </div>
            <div className="modal-action">
              <div className="max-h-60 overflow-x-auto"></div>
            </div>
            <button
              onClick={() => {
                setIsMembersModalOpen(-1);
              }}
              className="btn mx-2 mt-6 justify-center text-center"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal for subscribed topics array */}
      {isTopicsModalOpen >= 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
          <div className="max-w-md rounded-lg bg-white p-6">
            <h3 className="text-center text-lg font-bold">Subscribed Topics</h3>
            <p className="py-4"></p>
            <div className="left-0 top-0 float-left">
              {/* Creates new row for each element in subscribedTopics array */}
              {consumers[isTopicsModalOpen].subscribedTopics.map((member, index) => (
                <div key={index}>{member}</div>
              ))}
            </div>
            <div className="modal-action">
              <div className="max-h-60 overflow-x-auto"></div>
            </div>
            <button
              onClick={() => {
                setIsTopicsModalOpen(-1);
              }}
              className="btn mx-2 mt-6 justify-center text-center"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 w-full pl-12 pr-10 pb-20">
        {/* Refresh button */}
        <motion.button
          onClick={() => router.refresh()}
          className=" btn-small btn-warning glass btn-square btn float-right ml-5"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.8 }}
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/1/17/OOjs_UI_icon_reload.svg"
            width="20"
            height="20"
            alt="Reload"
          />
        </motion.button>

        <h1 className="mb-8 text-3xl">Consumer Groups</h1>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Group ID</th>
                <th>Protocol</th>
                <th>State</th>
                <th>Members</th>
                <th>Subscribed Topics</th>
              </tr>
            </thead>
            <tbody>
              {/* Creates new row for each consumer in consumerGroup array */}
              {consumers.map((consumer, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{consumer.groupId}</td>
                  <td>{consumer.protocol}</td>
                  <td>{consumer.state}</td>
                  <td>
                    <button
                      className="btn-ghost btn-sm border-black"
                      onClick={() => setIsMembersModalOpen(index)}
                    >
                      View members
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn-ghost btn-sm border-black"
                      onClick={() => setIsTopicsModalOpen(index)}
                    >
                      View subscribed topics
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ClusterConsumers;
