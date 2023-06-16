import { LineProvider } from '@/middleware/LineProvider';
import { ChakraProvider } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const Shared = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <ChakraProvider>
        <LineProvider>{children}</LineProvider>
      </ChakraProvider>
    </>
  );
};
