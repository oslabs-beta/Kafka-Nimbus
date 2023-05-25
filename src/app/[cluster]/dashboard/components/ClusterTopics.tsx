import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "~/app/redux/hooks";
import { useRouter } from "next/router";
import {
  settopicName,
  settopicPartitions,
  settopicReplications,
} from "~/app/redux/features/topicSlice";

const ClusterTopics = () => {
  // const router = useRouter();
  const dispatch = useAppDispatch();
  const [topicNameValue, setTopicName] = useState<string>("");
  const [partitionValue, setTopicPartitions] = useState<number>(0);
  const [replicationValue, setTopicReplications] = useState<number>(1);
  const TopicReplications: number[] = [1, 2, 3];
  const TopicPartitions: number[] = [1, 2, 3];
  const { topics } = useAppSelector((state) => state);

  // On submit from modal, state will be changed based on inputted data
  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(settopicName(topicNameValue));
    dispatch(settopicPartitions(partitionValue));
    dispatch(settopicReplications(replicationValue));
    console.log(topics);
  };

  // Handlers responsible for changing state upon data change
  const nameChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    console.log(event.currentTarget.value);
    setTopicName(event.currentTarget.value);
  };

  const partitionChangeHandler = (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    console.log(event.currentTarget.value);
    setTopicPartitions(Number(event.currentTarget.value));
  };

  const replicationChangeHandler = (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    console.log(event.currentTarget.value);
    setTopicReplications(Number(event.currentTarget.value));
  };

  // handler to reroute to topic page
  // const routerToTopic = () => {
  //   router.push('/dashboard');
  // };

  return (
    <>
      <div className="btn float-right ml-2 flex-col items-center">
        <label htmlFor="my-modal-4" className="btn">
          Create Topic
        </label>
      </div>

      {/* Table for topics */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Topic Name</th>
              <th>button to view partitions</th>
              <th>Cleanup Policy</th>
              <th>Retention.ms</th>
              <th>Offset</th>
            </tr>
          </thead>
          {/* Will populate new row for each topic in topic array */}
          {/* <tbody>
            {topics.map((topic) => (
              <tr key={topic.id}>
                <th>{topic.id}</th>
                <td>{topic.Endpoint}</td>
                <td>{topic.Count}</td>
              </tr>
            ))}
          </tbody> */}
        </table>
      </div>

      {/* Modal for topic creation */}
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
              Replication Count
            </label>
            <select
              className="w-xs select-bordered select w-full"
              onChange={replicationChangeHandler}
            >
              <option disabled value={"How many replications"}>
                How Many replications
              </option>
              {TopicReplications.map((num) => (
                <option value={num} key={num}>
                  {num}
                </option>
              ))}
            </select>
            <label htmlFor="aws-form" className="label">
              Number of Partitions
            </label>
            <select
              className="w-xs select-bordered select w-full"
              onChange={partitionChangeHandler}
            >
              <option disabled value={"How many replications"}>
                How Many partitions
              </option>
              {TopicPartitions.map((num) => (
                <option value={num} key={num}>
                  {num}
                </option>
              ))}
            </select>
            <div className="flex justify-center">
              <button className="btn-primary btn mx-2 mt-6" type="submit">
                Submit
              </button>
              <button className="btn-primary btn mx-2 mt-6" type="submit">
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
