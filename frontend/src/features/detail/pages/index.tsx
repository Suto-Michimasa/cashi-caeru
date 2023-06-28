import { TimestampType, timestampToDate, timestampToM_D } from '@/utils/timestamp';
import {
  Box,
  Button,
  HStack,
  Image,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Timestamp } from 'firebase-admin/firestore';
import { useRouter } from 'next/router';

export const DetailPage = () => {
  type getDetail = {
    loans: {
      createdAt: TimestampType;
      description: string;
      loanId: string;
      amount: number;
    }[];
    amount: number;
    deadline: TimestampType;
    pictureUrl: string;
    name: string;
  };

  const mockData: getDetail = {
    loans: [
      {
        createdAt: { _seconds: 3668498018, _nanoseconds: 349000000 },
        description: 'ビール',
        loanId: 'af15heof0uhw',
        amount: 250,
      },
      {
        createdAt: { _seconds: 2668498018, _nanoseconds: 349000000 },
        description: 'ワイン',
        loanId: 'af15heof0uhw',
        amount: -250,
      },
      {
        createdAt: { _seconds: 1668498018, _nanoseconds: 349000000 },
        description: 'ハイボール',
        loanId: 'af15heof0uhw',
        amount: 500,
      },
    ],
    amount: 500,
    deadline: { _seconds: 4668498018, _nanoseconds: 349000000 },
    pictureUrl: '/icon.jpg',
    name: '須藤路真',
  };

  const now = new Date();

  const router = useRouter();

  return (
    <VStack>
      <HStack p={'4px 0px'}>
        <Image
          src={mockData.pictureUrl}
          boxSize={'88px'}
          borderRadius={'50%'}
          p={'12px'}
        />
        <VStack align={'left'}>
          <HStack>
            <Text m={'0px'} color={'#777777'}>
              {mockData.name}
            </Text>
          </HStack>
          <HStack
            borderBottom={'2px solid #777777'}
            width={'56vw'}
            fontSize={'28px'}
            fontWeight={'bold'}
          >
            <Spacer />
            <Text m={'0px'}>{Number(mockData.amount) < 0 ? '-' : '+'}</Text>
            <Spacer />
            <Text m={'0px'}>
              {Math.abs(Number(mockData.amount)).toLocaleString()}
            </Text>
            <Text m={'0px'}>円</Text>
          </HStack>
          <HStack>
            <Spacer />
            <Text m={'0px'} color={'#777777'}>
              返済期限
            </Text>
            <Text
              color={
                timestampToDate(mockData.deadline) ?? now > now
                  ? '#1487E2'
                  : '#FF334B'
              }
              m={'0px'}
            >
              {timestampToM_D(mockData.deadline)}
            </Text>
          </HStack>
        </VStack>
      </HStack>
      <HStack w={'80vw'}>
        <Spacer />
        <Button
          bgColor={'#1487E2'}
          borderRadius={32}
          size={'lg'}
          m={'20px'}
          type="submit"
          h={12}
          onClick={() => router.push('/confirm/' + router.query.paymentId)}
        >
          <Text color={'white'} fontSize={'24px'} p={'8px'}>
            決済確認
          </Text>
        </Button>
      </HStack>
      {mockData.loans.map((element, index) => (
        <Box>
          <HStack>
            <Text m={'0px'} color={'#777777'}>
              {timestampToM_D(element.createdAt)}
            </Text>
          </HStack>
          <Box
            key={index}
            borderRadius={'20px'}
            border={'4px solid'}
            borderColor={Number(element.amount) > 0 ? '#1487E2' : '#FF334B'}
            m={'12px'}
            opacity={Number(element.amount) === 0 ? '0.3' : '1'}
            width={'80vw'}
            bgColor={
              Number(element.amount) > 0
                ? 'rgba(20, 135, 226, 0.1)'
                : 'rgba(255, 51, 75, 0.1)'
            }
            boxShadow="2xl"
          >
            <VStack p={1}>
              <HStack w={'60vw'}>
                <Text m={'0px'} color={'#777777'}>
                  {element.description}
                </Text>
                <Spacer />
              </HStack>
              <HStack
                borderBottom={'2px solid #777777'}
                width={'56vw'}
                fontSize={'28px'}
                fontWeight={'bold'}
              >
                <Spacer />
                <Text m={'0px'}>{Number(element.amount) < 0 ? '-' : '+'}</Text>
                <Spacer />
                <Text m={'0px'}>
                  {Math.abs(Number(element.amount)).toLocaleString()}
                </Text>
                <Text m={'0px'}>円</Text>
              </HStack>
            </VStack>
          </Box>
        </Box>
      ))}
    </VStack>
  );
};
