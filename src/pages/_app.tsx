import '../../styles/globals.css'
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import Layout from '../components/layout/Layout';

import 'tailwindcss/tailwind.css'

import { Session } from 'next-auth';
import PusherProvider from '../context/PusherContext';
import UsersProvider from '../context/UsersContext';
import { ModalProvider } from '../context/ModalContext';
import { FilterProvider } from '../context/FilterContext';
import { UserDropdownProvider } from '../context/UserDropdownContext';
import { MouseProvider } from '../context/MouseContext';
import { MessengerProvider } from '../context/MessengerContext';

const App = ({ Component, pageProps }: AppProps<{
  session: Session;
}>) => {
  return (
    <SessionProvider session={pageProps.session}>
      <MouseProvider>
        <UsersProvider>
          <PusherProvider>
            <ModalProvider>
              <MessengerProvider>
                <UserDropdownProvider>
                  <FilterProvider>
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                  </FilterProvider>
                </UserDropdownProvider>
              </MessengerProvider>
            </ModalProvider>
          </PusherProvider>
        </UsersProvider>
      </MouseProvider>
    </SessionProvider>
  );
};

export default App;