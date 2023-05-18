// "use client";
// import React, { useState } from "react";
// import brokerAddress from '../(components)/brokerAddress'
// import brokerid from '../(components)/brokerid'
// import brokerLeader from '../(components)/brokerLeader'
// import brokerSize from '../(components)/brokerSize'


import React, { useEffect, useState } from 'react';
import { PrismaClient, Broker } from '@prisma/client';


interface PageProps {
  params: {
    userId: string;
  };
}

const brokerDashboard = async ({ params }: PageProps) => {
  // error handling
  let brokers: Array<Broker> = [];
  try {
    const prisma = new PrismaClient();

    brokers = await prisma.broker.findMany({
      where: {
        broker: params.broker,
      },
    });
  } catch (error) {
    console.log(error);
  }
  return (
    <>
      <div>
        <button className="btn flex-col float-right ml-2 items-center">Create Broker</button>
      </div>
      <div className='flex h-[20vh] text-6xl flex-col items-center justify-center'>
        Brokers
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Address</th>
              <th>Size</th>
              <th>Leader</th>
            </tr>
          </thead>
          <tbody>
            {brokers.map((broker) => (
              <tr key={broker.brokerid}>
                <th>{broker.brokerid}</th>
                <td>{broker.brokerAddress}</td>
                <td>{broker.brokerSize}</td>
                <td>{broker.brokerLeader}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default brokerDashboard;
