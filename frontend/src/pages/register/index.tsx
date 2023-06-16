import Head from 'next/head';

import { getMainLayout } from '@/components/Layout';
import { NextPageWithLayout } from '@/pages/_app';
import { RegisterLoans } from '@/features/loans/pages/registerLoans';

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>貸しカエル🐸</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RegisterLoans />
    </>
  );
};

Page.getLayout = getMainLayout;

export default Page;
