import { redirect } from 'next/navigation';
import { getServerAuthSession } from '~/server/auth';

export const ServerSessionPage = async () => {
  const sessionData = await getServerAuthSession();
  if (!sessionData) {
    redirect('api/auth/signin?callbackUrl=/test/server'); //Add manual route ('signin?callbackUrl=/test/server')
  }
  return (
    <div>
      This is a server side protected page that you cannot see unless you are logged in.
      You are logged in as {sessionData?.user?.name}
    </div>
  );
}

export default ServerSessionPage;