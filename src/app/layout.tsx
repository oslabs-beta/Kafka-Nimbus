import { AuthProvider } from './components/AuthProvider';
import { ClientProvider } from '../trpc/trpc-provider';
import NavBar from './components/NavBar';
import { Providers } from './redux/provider';
import '../styles/globals.css';

export const metadata = {
  title: 'Kafka Nimbus',
  description: 'Deploy Kafka Clusters to the cloud.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <ClientProvider>  {/* Gives children access to trpc routes */}
          <AuthProvider>  {/* Gives childredn access to session data */}
            <Providers>   {/* Gives childred access to redux store */}
              <NavBar />
              {children}
            </Providers>
          </AuthProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
