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
  // Fetching the cluster status to display
    const { data: status } = trpc.createCluster.checkClusterStatus.useQuery({
      id: cluster.id
    })


  const [delCluster, setdelCluster] = React.useState<string>('');
  const [isHoverDelete, setIsHoverDelete] = React.useState<boolean>(false);


  const deleteCluster = trpc.createCluster.deleteCluster.useMutation();


  console.log('STATUS',status)
  const routeToCluster = () => {
    if (!isHoverDelete && status === 'ACTIVE') router.push(`${cluster.id}/dashboard`)
    else return;
  };


  
  const statusColor = status === 'ACTIVE' ? 'green' : 'red';

  console.log(`text-${statusColor}-600`);
  return (
    <div
      onClick={routeToCluster}
      className='max-w-98 card h-48 w-72 overflow-hidden rounded-xl bg-base-100 shadow-xl hover:ring-4 '
    >
      <figure className='w-full'>
        <div className={`h-24 w-full object-cover ${cluster.img}`} />
      </figure>
      <div className='m-4 flex w-full flex-col justify-between'>
        <h2 className='card-title '>{cluster.name}</h2>
        <div className='flex items-end justify-end'>
          {statusColor ? (
            <p
              className={`text-${statusColor}-600  mr-6 w-min rounded-xl bg-${statusColor}-100  mx-1 items-end px-4 align-bottom shadow-md`}
            >
              {status}
            </p>
          ) : null}


  const deleteClusterHandler = async () => {
    try {
      console.log('----------------Deleting cluster');
      await deleteCluster.mutateAsync({
        id: cluster.id
      });
      console.log('----------------Rerouting cluster');
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
        {/* <label style={{ position: 'absolute', zIndex: 7 }} className="modal-backdrop" htmlFor={`modal${cluster.name}${cluster.id}`}>BACKDROP</label> */}
      </div>

      <div
        onClick={routeToCluster}
        style={{ position: 'relative', zIndex: 5 }}
        className={`card h-48 max-w-98 w-72 overflow-hidden rounded-xl bg-base-100 shadow-xl ${(status === 'ACTIVE') ? 'hover:ring-4 cursor-pointer' : ''}`}
      >
        <figure className='w-full'>
          <div className={`h-24 w-full object-cover ${gradients[random]}`} />
        </figure>
        <div className='m-4 flex w-full flex-col justify-between'>
          <h2 className='card-title '>{cluster.name}</h2>
          <div className='flex justify-end items-end'>
            <p
              className={`text-${statusColor}-600  mr-6 w-min rounded-xl bg-${statusColor}-100  px-4 align-bottom mx-1 items-end shadow-md`}
            >
              {status}
            </p>
          </div>
        </div>
        {(status === 'ACTIVE') ? <label onMouseEnter={() => setIsHoverDelete(true)} onMouseLeave={() => setIsHoverDelete(false)} htmlFor={`modal${cluster.name}${cluster.id}`} style={{ position: 'absolute', zIndex: 8 }} className="top-0 right-0 bg-red-600 hover:bg-red-800 text-white text-sm px-3.5 py-2.5 m-0.5 rounded-full hover:border-slate-400 hover:border-solid">X</label> : null}

      </div >
    </>

  );
}
