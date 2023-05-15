import { type AppType } from "next/app";
import { type Session } from "next-auth";
import Link from 'next/link';
// import { SessionProvider } from "next-auth/react";
import { Provider } from "./components/Provider";
import '../styles/globals.css';

// import { api } from "~/utils/api";

// const MyApp: AppType<{ session: Session | null }> = ({
//   Component,
//   pageProps: { session, ...pageProps },
// }) => {
//   return (
//     <SessionProvider session={session}>
//       <Component {...pageProps} />
//     </SessionProvider>
//   );
// };

/**
 * Need to export SessionProvider in Next13 because it is a context Provider using react Context so it needs to be a client component. 
 * Originally you designed your own custom top level MyApp component and then wrapped in it SessionProvider
 * Next13 uses RootLayout (outermost layer of our application). Must contain html and body tags
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts
 * Can add header and footer here so all pages have those shared components
 */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <header className='flex h-24 flex-col justify-center bg-stone-100'>
            <nav className='container'>
              <ul className='flex items-center justify-between gap-8 font-medium tracking-wider text-stone-500'>
                <li className='text-sm'>
                  <Link href='/'>Home</Link>
                </li>
                <li className='text-sm'>
                  <Link href='./test/server'>Server Session</Link>
                </li>
                <li className='text-sm'>
                  <Link href='./test/client'>Client Session</Link>
                </li>
                <li>
                </li>
              </ul>
            </nav>
          </header>
          {children}
        </Provider>
      </body>
    </html>
  );
}

// export default api.withTRPC(MyApp);
// export default MyApp;