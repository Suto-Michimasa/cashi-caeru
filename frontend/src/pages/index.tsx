import Head from 'next/head';

import { getMainLayout } from '@/components/Layout';
import { DashboardPage } from '@/features/dashboard';
import { NextPageWithLayout } from '@/pages/_app';

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>貸しカエル🐸</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardPage />
    </>
  )
}

Page.getLayout = getMainLayout;

export default Page;
