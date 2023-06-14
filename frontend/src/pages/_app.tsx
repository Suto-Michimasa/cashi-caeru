import { ReactElement, ReactNode } from 'react';

import type { AppProps } from 'next/app';

import { NextPage } from 'next';

export type GetLayout = (page: ReactElement) => ReactNode;

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: GetLayout;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return getLayout(<Component {...pageProps} />);
}
