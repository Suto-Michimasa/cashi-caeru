import { LineProvider } from '@/middleware/LineProvider';
import { ReactNode } from 'react';

export const Shared = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <LineProvider>
        {children}
      </LineProvider>
    </>
  );
};
