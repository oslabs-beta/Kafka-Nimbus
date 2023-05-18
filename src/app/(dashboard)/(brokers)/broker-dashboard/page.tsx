import React, { useEffect, useState } from 'react';
import { PrismaClient, Broker } from '@prisma/client';
import Link from 'next/link';
import { Suspense } from 'react';


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
        broker: params.brokerid,
      },
    });
  } catch (error) {
    console.log(error);
  }

  if (brokers.length === 0) {
    return (
<Suspense fallback={<h2>Loading...</h2>}>
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button">Open drawer</label>
        <div className="flex justify-center items-center">No Brokers in this Cluster</div>
        <div className="flex justify-center items-center">
        <Link href='/create-broker'><button className="btn">Create Broker</button></Link>
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
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button"></label>
      <div>
        <Link href='/create-broker'><button className="btn flex-col float-right ml-2 items-center">Create Broker</button></Link>
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
              <th>Address</th>
              <th>Size</th>
              <th>Leader</th>
            </tr>
          </thead>
          <tbody>
            {brokers.map((broker) => (
              <tr key={broker.brokerid}>
                <th>{broker.brokerAddress}</th>
                <td>{broker.brokerSize}</td>
                <td>{broker.brokerLeader}</td>
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

export default brokerDashboard;
