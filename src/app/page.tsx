'use client';   
import { type NextPage } from 'next';
import Link from 'next/link';
import { AuthShowcase } from './components/AuthShowcase';
import { api } from '~/trpc/api';



const Home: NextPage = () => {
  // const test = appRouter.example.hello()
  return (
    <>
      <main className=''>
        <div className=' hero flex flex-col items-center justify-center py-16'>
          <div className='hero-content flex w-full max-w-md flex-col items-center align-middle'>
            <h1 className='text-center text-6xl font-bold'>
              Deploy Kafka Clusters to the Cloud
            </h1>
            <p className='py-6 text-2xl text-center'>
              All in one solution for managing and deploying your clusters to
              the cloud
            </p>
            <div className=' flex gap-4'>
              <Link href='https://github.com/Kafka-Nimbus/Kafka-Nimbus-GUI/blob/main/README.md'>
                <button className='btn-primary btn '>Get Started</button>
              </Link>
              <AuthShowcase />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

// export default Home;
export default api.withTRPC(Home);
