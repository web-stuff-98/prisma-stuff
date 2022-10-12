import '../../styles/globals.css'
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import Layout from '../components/layout/Layout';

import 'tailwindcss/tailwind.css'

import { Session } from 'next-auth';
import PusherProvider from '../context/PusherContext';
import UsersProvider from '../context/UsersContext';
import { ModalProvider } from '../context/ModalContext';

const App = ({ Component, pageProps }: AppProps<{
  session: Session;
}>) => {
  return (
    <SessionProvider session={pageProps.session}>
      <UsersProvider>
        <PusherProvider>
          <ModalProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ModalProvider>
        </PusherProvider>
      </UsersProvider>
    </SessionProvider>
  );
};

export default App;