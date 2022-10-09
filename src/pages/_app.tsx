import '../../styles/globals.css'
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import Layout from '../components/layout/Layout';

import 'tailwindcss/tailwind.css'

import { Session } from 'next-auth';

const App = ({ Component, pageProps }: AppProps<{
  session: Session;
}>) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
};

export default App;