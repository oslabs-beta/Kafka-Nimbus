/* eslint-disable @next/next/no-img-element */
'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '~/trpc/trpc-provider';

export interface cardCluster {
  cluster: {
    img: string;
    name: string;
    id: string;
    lifeCycleStage: number;
  };
}

export default function ClusterCard({ cluster }: cardCluster) {
  const router = useRouter();
  let clusterStatus: string;
  // Fetching the cluster status to display
  if (cluster.lifeCycleStage !== 2) {
    const { data: status } = trpc.createCluster.checkClusterStatus.useQuery({
      id: cluster.id
    });
    clusterStatus = status ? status : '';
    console.log("status:", status)
  } else { clusterStatus = 'ACTIVE' }



  const [delCluster, setdelCluster] = React.useState<string>('');
  const [isHoverDelete, updateHover] = React.useState<boolean>(false);
  //Currently isHoverDelete is a react hook in order to re-render the cluster card to not show hover border when hovering over the delete button
  // let isHoverDelete = false;
  // const updateHover = (bool: boolean): void => { isHoverDelete = bool; }


  const deleteCluster = trpc.createCluster.deleteCluster.useMutation();

  const routeToCluster = () => {
    if (!isHoverDelete && clusterStatus === 'ACTIVE' && cluster.lifeCycleStage === 2) {
      router.push(`${cluster.id}/dashboard`);
      console.log('Rerouting to cluster-dashboard for cluster: ', cluster.name);
    }
    else {
      console.log('Rerouting denied for cluster: ', cluster.name);
      return;
    }
  }

  // changes color based on status
  const statusColor = clusterStatus === 'ACTIVE' ? 'green'
        : clusterStatus === 'UPDATING' ? console.log(clusterStatus)
        : clusterStatus === 'CREATING' ? 'blue'             
        : 'red';

  //The API call to backend to handle deleting the cluster in AWS and DB
  const deleteClusterHandler = () => {
    try {
      deleteCluster.mutate({
        id: cluster.id
      });
      router.push('/cluster-dashboard');
    } catch (err) {
      console.log('Error occurred when deleting cluster on frontend: ', err);
    }
  }

  return (
    <>

      <input type="checkbox" id={`modal${cluster.name}${cluster.id}`} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">DELETE {cluster.name}?</h3>
          <p className="py-4">WARNING: Once a cluster is undergoing deletion it cannot be reversed</p>
          <p>To confirm deletion, type the cluster name in the text input field. </p>
          <input className="border-solid border-2 border-black-600" placeholder={cluster.name} value={delCluster} onChange={e => setdelCluster(e.target.value)} />
          <div className="modal-action">
            <button className="btn" disabled={delCluster !== cluster.name} onClick={deleteClusterHandler}>DELETE</button>
            <label onClick={() => setdelCluster('')} htmlFor={`modal${cluster.name}${cluster.id}`} className="btn">CANCEL</label>
          </div>

        </div>
        {/* <label className="modal-backdrop" htmlFor={`modal${cluster.name}${cluster.id}`}>BACKDROP</label> */}
      </div>

      <div
        onClick={routeToCluster}
        className={`relative card h-48 max-w-98 w-72 rounded-xl bg-base-100 shadow-xl ${(clusterStatus === 'ACTIVE' && !isHoverDelete) ? 'hover:ring-4 cursor-pointer' : ''}`}
      >
        <figure className='w-full'>
          <div className={`h-24 w-full object-cover ${cluster.img}`} />
        </figure>
        <div className='m-4 flex w-full flex-col justify-between'>
          <h2 className='card-title '>{cluster.name}</h2>
          <div className='flex justify-end items-end'>
            <p
              className={`text-green-600  mr-6 w-min rounded-xl bg-green-100  px-4 align-bottom mx-1 items-end shadow-md`}
            >
              {clusterStatus}
            </p>
          </div>
        </div>
        {(clusterStatus === 'ACTIVE') ?
          <label className="absolute -top-2 -right-2 bg-white transition duration-300 hover:bg-red-600 text-black font-semibold hover:text-black p-2 border border-black hover:border-transparent rounded-full cursor-pointer" onMouseEnter={() => updateHover(true)} onMouseLeave={() => updateHover(false)} htmlFor={`modal${cluster.name}${cluster.id}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </label>
          : null}
      </div >
    </>

  );
}
