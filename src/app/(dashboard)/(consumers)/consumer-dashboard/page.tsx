import React, { useEffect, useState } from 'react';
import { PrismaClient, Consumer } from '@prisma/client';
import Link from 'next/link';
import { Suspense } from 'react';

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
        consumerid: params.consumerid,
      },
    });
  } catch (error) {
    console.log(error);
  }
  if (consumers.length !== 0) {
    return (
<Suspense fallback={<h2>Loading...</h2>}>
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button">Open drawer</label>
        <div className="flex justify-center items-center">No Consumer Groups in this Cluster</div>
        <div className="flex justify-center items-center">
        <Link href='/create-consumer'><button className="btn">Create Consumer</button></Link>
      </div>
      </div> 

      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 bg-base-100 text-base-content">
        <div className="divider"></div> 
          <li><Link href="/broker-dashboard" className="btn btn-outline btn-primary">Brokers</Link></li>
          <div className="divider"></div> 
          <li><Link href="/topic-dashboard" className="btn btn-outline btn-primary">Topics</Link></li>
          <div className="divider"></div> 
          <li><Link href="/consumer-dashboard" className="btn btn-outline btn-primary">Consumers</Link></li>
        </ul>
      </div>
    </div>
    </Suspense>
    )
  } else {
  return (
    <>
<Suspense fallback={<h2>Loading...</h2>}>
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button">Open drawer</label>
      <div>
        <Link href='/create-consumer'><button className="btn flex-col float-right ml-2 items-center">Create consumer</button></Link>
      </div>
      <div className='flex h-[20vh] text-6xl flex-col items-center justify-center'>
        Consumer Groups
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Consumer Group</th>
              <th>Status</th>
              <th>Total Lag</th>
              <th>Patitions/Topics</th>
            </tr>
          </thead>
          <tbody>
            {consumers.map((consumer) => (
              <tr key={consumer.consumerid}>
                <th>{consumer.consumerid}</th>
                <td>{consumer.consumerEndpoint}</td>
                <td>{consumer.consumerCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div> 

      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 bg-base-100 text-base-content">
        <div className="divider"></div> 
          <li><Link href="/broker-dashboard" className="btn btn-outline btn-primary">Brokers</Link></li>
          <div className="divider"></div> 
          <li><Link href="/topic-dashboard" className="btn btn-outline btn-primary">Topics</Link></li>
          <div className="divider"></div> 
          <li><Link href="/consumer-dashboard" className="btn btn-outline btn-primary">Consumers</Link></li>
        </ul>
      </div>
    </div>
    </Suspense>
    </>
  );
}
};

export default consumerDashboard;
