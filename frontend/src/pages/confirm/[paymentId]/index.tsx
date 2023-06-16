import Head from 'next/head';

import { getMainLayout } from '@/components/Layout';
import { NextPageWithLayout } from '@/pages/_app';
import { ConfirmPage } from '@/features/confirm/pages';

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>貸しカエル🐸</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConfirmPage />
    </>
  );
};

Page.getLayout = getMainLayout;

export default Page;
