import React, { useEffect, useState } from 'react';
import { PrismaClient, Consumer } from '@prisma/client';

interface PageProps {
  params: {
    userId: string;
  };
}

const consumerDashboard = async ({ params }: PageProps) => {
  // error handling
  let consumers: Array<Consumer> = [];
  try {
    const prisma = new PrismaClient();

    consumers = await prisma.consumer.findMany({
      where: {
        userId: params.userId,
      },
    });
  } catch (error) {
    console.log(error);
  }
  return (
    <>
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
            {consumers.map((consumer) => (
              <tr key={consumer.consumerid}>
                <th>{consumer.brokerid}</th>
                <td>{consumer.consumerEndpoint}</td>
                <td>{consumer.consumerCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default consumerDashboard;
