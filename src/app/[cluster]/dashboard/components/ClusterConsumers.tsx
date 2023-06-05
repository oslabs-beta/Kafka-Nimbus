"use client";
import React, { useState } from "react";

const ClusterConsumers = ({ consumers }) => {
  console.log("consumers:", consumers);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(-1);
  const [isTopicsModalOpen, setIsTopicsModalOpen] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Modal for members array */}
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

      <div className="mt-8 w-full p-8">
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
