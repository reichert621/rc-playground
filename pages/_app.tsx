import '@/styles/globals.css';
import type {AppProps} from 'next/app';
import Head from 'next/head';
import {Inter, Fira_Code} from 'next/font/google';
import {SessionProvider} from 'next-auth/react';

import db from '@/lib/instant';

const sans = Inter({
  variable: '--font-sans',
  display: 'swap',
  subsets: ['latin'],
});

const mono = Fira_Code({
  variable: '--font-mono',
  display: 'swap',
  subsets: ['latin'],
});

export default function App({
  Component,
  pageProps: {session, ...pageProps},
}: AppProps) {
  return (
    <>
      <Head>
        <title>RC Playground</title>
      </Head>
      <style jsx global>
        {`
          :root {
            --font-sans: ${sans.style.fontFamily};
            --font-mono: ${mono.style.fontFamily};
          }
        `}
      </style>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}
