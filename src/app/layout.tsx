import { Provider } from "./components/Provider";
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
        <Provider>
          <Providers>
            <NavBar />
            {children}
          </Providers>
        </Provider>
      </body>
    </html>
  );
}

