
import { Provider } from "../components/Provider";
import { Providers } from "../../redux/provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Provider>
            {children}
          </Provider>
        </Providers>
      </body>
    </html>
  );
}