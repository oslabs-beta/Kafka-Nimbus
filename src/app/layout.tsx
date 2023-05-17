import { AuthProvider } from "./components/AuthProvider";
import NavBar from "./components/NavBar";
import { Providers } from "./redux/provider";
import "../styles/globals.css";


export const metadata = {
  title: "Kafka Nimbus",
  description: "Deploy Kafka Clusters to the cloud.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Providers>
            <NavBar />
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}

