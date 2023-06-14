import { ReactNode } from 'react';

import { Shared } from '@/components/Layout/Shared';

import { GetLayout } from '@/pages/_app';

const MainLayout = ({ children }: { children: ReactNode }) => {
  //TODO: 全画面で使うタブ等を入れる
  return (
    <main>
      {children}
    </main>
  );
};

export const getMainLayout: GetLayout = (page) => {
  return (
    <Shared>
      <MainLayout>{page}</MainLayout>
    </Shared>
  );
};
