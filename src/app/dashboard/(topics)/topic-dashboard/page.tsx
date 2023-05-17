import React, { useEffect, useState } from 'react';
import { PrismaClient, Topic } from '@prisma/client';

interface PageProps {
  params: {
    userId: string;
  };
}

const topicDashboard = async ({ params }: PageProps) => {
  // error handling
  let topics: Array<Topic> = [];
  try {
    const prisma = new PrismaClient();

    topics = await prisma.topic.findMany({
      where: {
        userId: params.userId,
      },
    });
  } catch (error) {
    console.log(error);
  }
  return (
    <>
      <div>
        <button className="btn flex-col float-right ml-2 items-center">Create Topic</button>
      </div>
      <div className='flex h-[20vh] text-6xl flex-col items-center justify-center'>
        Topics
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Endpoint</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => (
              <tr key={topic.topicid}>
                <th>{topic.topicid}</th>
                <td>{topic.topicEndpoint}</td>
                <td>{topic.topicCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      

    </>
  );
};

export default topicDashboard;
