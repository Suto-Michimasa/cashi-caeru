import React from 'react';
import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  HStack,
  Image,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { DashboardData } from '../types';
import { timestampToM_D } from '@/utils/timestamp';

type Props = {
  dashboardData: DashboardData;
}

const mainColorSelector = (amount: number) => {
  if (amount > 0) return '#1487E2';
  if (amount < 0) return '#FF334B';
  else return 'black';
};

const bgColorSelector = (amount: number) => {
  if (amount > 0) return 'rgba(20, 135, 226, 0.1)';
  if (amount < 0) return 'rgba(255, 51, 75, 0.1)';
  else return 'rgba(0, 0, 0, 0.1)';
};

export const TopPageComponent: React.FC<Props> = ({ dashboardData }) => {
  return (
    <VStack>
      <HStack width={'80vw'} p={'16px 0px'}>
        <Spacer />
        <HStack
          borderBottom={'2px solid #777777'}
          fontSize={'24px'}
          fontWeight={'bold'}
          width={'60vw'}
        >
          <Text m={'0px'}>合計収支</Text>
          <Spacer />
          <Text m={'0px'}>{dashboardData.totalBalance.toLocaleString()}</Text>
          <Text m={'0px'}>円</Text>
        </HStack>
      </HStack>
      {dashboardData.payments.map((element, index) => (
        <Box
          key={index}
          borderRadius={'20px'}
          border={'4px solid'}
          borderColor={mainColorSelector(Number(element.amount))}
          m={'12px'}
          opacity={Number(element.amount) === 0 ? '0.3' : '1'}
          width={'80vw'}
          bgColor={bgColorSelector(Number(element.amount))}
          boxShadow="2xl"
        >
          <HStack p={'4px 0px'}>
            <Image
              src={element.pictureUrl}
              boxSize={'56px'}
              borderRadius={'50%'}
              p={'12px'}
            />
            <VStack align={'left'}>
              <HStack>
                <Text m={'0px'}>{element.name}</Text>
              </HStack>
              <HStack
                borderBottom={'2px solid #777777'}
                width={'56vw'}
                fontSize={'28px'}
                fontWeight={'bold'}
              >
                <Text m={'0px'}>
                  {Number(element.amount) < 0 ? '-' : '+'}
                </Text>
                <Spacer />
                <Text m={'0px'}>
                  {Math.abs(Number(element.amount)).toLocaleString()}
                </Text>
                <Text m={'0px'}>円</Text>
              </HStack>
              <HStack>
                <Spacer />
                <Text m={'0px'}>返済期限</Text>
                <Text
                  color={mainColorSelector(Number(element.amount))}
                  m={'0px'}
                >
                  {timestampToM_D(element.deadline)}
                </Text>
              </HStack>
            </VStack>
          </HStack>
        </Box>
      ))}
      <Box
        bgColor={'#2196F3'}
        borderRadius={'50%'}
        position={'absolute'}
        right={'16px'}
        bottom={'16px'}
      >
        <Flex>
          <AddIcon color={'white'} fontSize={'24px'} p={'24px'} />
        </Flex>
      </Box>
    </VStack>
  );
};
