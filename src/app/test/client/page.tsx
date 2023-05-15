'use client';

import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';

export const ClientSessionPage = () => {
  const { data: sessionData } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('api/auth/signin?callbackUrl=/test/client') //Add manual route ('signin?callbackUrl=/test/client')
    }
  })
  return (
    <div>
      This is a client side protected page that you cannot see unless you are logged in.
      You are logged in as {sessionData?.user?.name}
    </div>
  );
}

export default ClientSessionPage;