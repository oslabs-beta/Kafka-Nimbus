import React from "react";
import { useAppDispatch, useAppSelector } from "~/app/redux/hooks";
import {
  settopicName,
  settopicPartitions,
  settopicReplications,
  setcleanUpPolicy,
} from "~/app/redux/features/createTopicSlice";
import { trpc } from "../../../../trpc/trpc-provider";

const ClusterTopics = () => {
  const dispatch = useAppDispatch();
  const TopicReplications: number[] = [1, 2, 3];
  const TopicPartitions: number[] = [1, 2, 3];
  const CleanUpPolicy: string[] = ["compact", "delete"];
  const { topics } = useAppSelector((state) => state);
  const createNewTopic = trpc.topic.createTopic.useMutation();

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(topics);
  };

  const partitionChangeHandler = (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    console.log(event.currentTarget.value);
    dispatch(settopicPartitions(parseInt(event.currentTarget.value, 10)));
  };

  const replicationChangeHandler = (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    console.log(event.currentTarget.value);
    dispatch(settopicReplications(parseInt(event.currentTarget.value, 10)));
  };

  const policyHandler = (event: React.FormEvent<HTMLSelectElement>) => {
    console.log(event.currentTarget.value);
    dispatch(setcleanUpPolicy(event.currentTarget.value));
  };

  const nameChangeHandler = (event: React.FormEvent<HTMLSelectElement>) => {
    console.log(event.currentTarget.value);
    dispatch(settopicName(event.currentTarget.value));
  };

  const createTopicHandler = async () => {
    const { 
      Name, 
      numPartitions, 
      replicationFactor, 
      cleanUpPolicy 
    } = topics;
    await createNewTopic.mutateAsync({
      topicName: Name,
      numPartitions: numPartitions,
      configEntries: [{ cleanUpPolicy: cleanUpPolicy }],
      clusterName: "", // Provide the cluster name here
    });
  };

  return (
    <>
      <div className="btn float-right ml-2 flex-col items-center">
        <label htmlFor="my-modal-4" className="btn">
          Create Topic
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Topic Name</th>
              <th>Cleanup Policy</th>
              <th>Retention.ms</th>
              <th>Offset</th>
              <th>Button to view partitions</th>
            </tr>
          </thead>
        </table>
      </div>

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
            <label htmlFor="aws-form" className="label">
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
            <label htmlFor="aws-form" className="label">
              Clean up Policy
            </label>
            <select
              className="w-xs select-bordered select w-full"
              onChange={policyHandler}
            >
              <option disabled>Which Policy</option>
              {CleanUpPolicy.map((str) => (
                <option key={str}>{str}</option>
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
              <button className="btn-primary btn mx-2 mt-6" type="button">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </label>
    </>
  );
};

export default ClusterTopics;