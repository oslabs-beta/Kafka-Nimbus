"use client";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "~/app/redux/hooks";
import {
  settopicName,
  settopicPartitions,
  settopicReplications,
} from "~/app/redux/features/createSingleTopicSlice";
import { trpc } from "../../../../trpc/trpc-provider";

const ClusterTopics = ({ topics, clusterInfo, clusterid }) => {
  // Limits replication factor to only be equal to or less than amount of brokers
  const replicationArray: number[] = [];
  for (let i = 1; i <= clusterInfo.NumberOfBrokerNodes; i++) {
    replicationArray.push(i);
  }

  // Caclulates total offset for each topic
  const calculateOffset = (offsets: any[]): number => {
    let totalOffset = 0;
    for (let i = 0; i < offsets.length; i++) {
      const offset = Number(offsets[i].offset);
      totalOffset += offset;
    }
    return totalOffset;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPartitionsModalOpen, setIsPartitionsModalOpen] = useState(-1);

  const dispatch = useAppDispatch();
  const TopicReplications: number[] = replicationArray;
  const TopicPartitions: number[] = [1, 2, 3, 4, 5, 7, 8, 9, 10]; // Determine how many partitions we want to allow
  const { createTopic } = useAppSelector((state) => state);
  const createNewTopic = trpc.topic.createTopic.useMutation();

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(createTopic);
  };

  // keeps track of partition change
  const partitionChangeHandler = (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    console.log(event.currentTarget.value);
    dispatch(settopicPartitions(parseInt(event.currentTarget.value)));
  };

  // keeps track of replication change
  const replicationChangeHandler = (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    console.log(event.currentTarget.value);
    dispatch(settopicReplications(parseInt(event.currentTarget.value)));
  };

  // keeps track of name change
  const nameChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    console.log(event.currentTarget.value);
    dispatch(settopicName(event.currentTarget.value));
  };

  // creates a new topic
  const createTopicHandler = async () => {
    const { Name, numPartitions, replicationFactor } =
      createTopic;
    // api call
    await createNewTopic.mutateAsync({
      id: clusterid,
      topicName: Name,
      numPartitions: numPartitions,
      replicationFactor: replicationFactor,
    });
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Modal for partitions array */}
      {isPartitionsModalOpen >= 0 && (
        <form
          method="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50"
        >
          <div className="max-w-md justify-center rounded-lg bg-white p-6">
            <h3 className="text-center text-lg font-bold">Partitions</h3>
            <p className="py-4"></p>
            <div className="modal-action">
              <div className="max-h-60 overflow-x-auto">
                <table className="table w-full ">
                  <thead>
                    <tr>
                      <th>Partition ID</th>
                      <th>Leader</th>
                      <td>Replicas</td>
                      <th>ISR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Creates new partitions row for each partition in topic */}
                    {topics[isPartitionsModalOpen].partitions.map(
                      (partition, index) => (
                        <tr key={index}>
                          <td>{partition.partitionId}</td>
                          <td>{partition.leader}</td>
                          <td>{partition.replicas}</td>
                          <td>{partition.isr}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <button
              onClick={() => {
                setIsPartitionsModalOpen(-1);
              }}
              className="btn mx-2 mt-6 justify-center text-center"
            >
              Close
            </button>
          </div>
        </form>
      )}

      {/* Table to display topic information */}
      <div className="mt-8 w-full p-8">
        <h1 className="mb-8 text-3xl">
          Topics
          <div className="btn float-right ml-2 flex-col items-center">
            <label htmlFor="my-modal-4" className="btn">
              Create Topic
            </label>
          </div>
        </h1>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Topic ID</th>
                <th>Topic Name</th>
                <td>Clean up Policy</td>
                <th>Total Offset</th>
                <th>Partitions</th>
              </tr>
            </thead>
            <tbody>
              {/* Creates new topic row for each topic in cluster */}
              {topics.map((topic, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{topic.name}</td>
                  <td>{topic.config[0].configValue}</td>
                  <th>{calculateOffset(topic.offsets)}</th>
                  <td>
                    <button
                      className="btn-ghost btn-sm border-black"
                      onClick={() => setIsPartitionsModalOpen(index)}
                    >
                      View Partitions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for creating a new topic */}
        <input type="checkbox" id="my-modal-4" className="modal-toggle" />
        <label htmlFor="my-modal-4" className="modal cursor-pointer">
          <div className="modal-box relative w-3/5">
            <form id="topic-form" onSubmit={onSubmitHandler}>
              <label htmlFor="topic-form" className="label">
                Topic Name
              </label>
              <input
                onChange={nameChangeHandler}
                type="text"
                placeholder="Name"
                className="w-xs input-bordered input mt-1 w-full rounded-md p-2"
              />
              <label htmlFor="awsf-form" className="label">
                Replication Factor
              </label>
              <select
                className="w-xs select-bordered select w-full"
                onChange={replicationChangeHandler}
              >
                <option disabled>How Many replications</option>
                {TopicReplications.map((num) => (
                  <option key={num}>{num}</option>
                ))}
              </select>
              <label htmlFor="aws-form" className="label">
                Number of Partitions
              </label>
              <select
                className="w-xs select-bordered select w-full"
                onChange={partitionChangeHandler}
              >
                <option disabled>How Many partitions</option>
                {TopicPartitions.map((num) => (
                  <option key={num}>{num}</option>
                ))}
              </select>
              <div className="flex justify-center">
                <button
                  className="btn-primary btn mx-2 mt-6"
                  type="submit"
                  onClick={createTopicHandler}
                >
                  Submit
                </button>
                <label
                  className="btn-primary btn mx-2 mt-6"
                  onClick={() => setIsModalOpen(false)}
                  htmlFor="my-modal-4"
                >
                  Cancel
                </label>
              </div>
            </form>
          </div>
        </label>
      </div>
    </>
  );
};

export default ClusterTopics;
