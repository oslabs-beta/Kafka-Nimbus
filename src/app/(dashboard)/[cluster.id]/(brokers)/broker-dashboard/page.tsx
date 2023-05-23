import { PrismaClient, Broker } from "@prisma/client";
import Link from "next/link";
import { Suspense } from "react";


interface PageProps {
  params: {
    clusterId: string;
  };
  cluster: {
    id: string;
  };
}

const brokerDashboard = async ({ params, cluster }: PageProps) => {
  let brokers: Broker[] = [];
  try {
    const prisma = new PrismaClient();

    brokers = await prisma.broker.findMany({
      where: {
        clusterId: params.clusterId,
      },
    });
  } catch (error) {
    console.log(error);
  }  

  return (
    <>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="my-drawer"
              className="btn-primary drawer-button btn"
            >
              Open Drawer
            </label>
            <div>
              <Link href="/create-broker">
                <button className="btn float-right ml-2 flex-col items-center">
                  Create Broker
                </button>
              </Link>
            </div>
            <div className="flex h-[20vh] flex-col items-center justify-center text-6xl">
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
                    <tr key={broker.id}>
                      <th>{broker.Address}</th>
                      <td>{broker.Size}</td>
                      <td>{broker.Leader}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <ul className="menu w-80 bg-base-100 p-4 text-base-content">
              <div className="divider"></div>
              <li>
                <Link
                  href='/broker-dashboard'
                  className="btn-primary btn-outline btn"
                >
                  Brokers
                </Link>
              </li>
              <div className="divider"></div>
              <li>
                <Link
                  href="/topic-dashboard"
                  className="btn-primary btn-outline btn"
                >
                  Topics
                </Link>
              </li>
              <div className="divider"></div>
              <li>
                <Link
                  href="/consumer-dashboard"
                  className="btn-primary btn-outline btn"
                >
                  Consumers
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default brokerDashboard;
