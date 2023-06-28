import Head from 'next/head';

import { getMainLayout } from '@/components/Layout';
import { TopPage } from '@/features/top/pages';
import { NextPageWithLayout } from '@/pages/_app';

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>貸しカエル🐸</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TopPage />
    </>
  )
}

Page.getLayout = getMainLayout;

export default Page;
