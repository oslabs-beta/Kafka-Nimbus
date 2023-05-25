import { PrismaClient, Topic } from '@prisma/client';
import Link from 'next/link';
import { Suspense } from 'react';

interface PageProps {
  params: {
    userId: string;
  };
}

const topicDashboard = async ({ params }: PageProps) => {
  // error handling
  let topics: Topic[] = [];
  try {
    const prisma = new PrismaClient();

    topics = await prisma.topic.findMany({
      where: {
        clusterId: params.userId,
      },
    });
  } catch (error) {
    throw new Error("topicDashboard error");
  }  
  if (topics.length === 0) {
    return (
<Suspense fallback={<h2>Loading...</h2>}>
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button">Open drawer</label>
        <div className="flex justify-center items-center">No Topics in this Cluster</div>
        <div className="flex justify-center items-center">
        <Link href='/create-topic'><button className="btn">Create Topic</button></Link>
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
        <Link href='/create-topic'><button className="btn flex-col float-right ml-2 items-center">Create Topic</button></Link>
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
              <tr key={topic.id}>
                <th>{topic.id}</th>
                <td>{topic.Endpoint}</td>
                <td>{topic.Count}</td>
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

export default topicDashboard;
