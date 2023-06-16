import {
  Box,
  Button,
  HStack,
  Image,
  Link,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';

export const ConfirmPage = () => {
  const mockData = {
    name: '古賀勇大',
    amount: 500,
    pictureUrl: '/icon.jpg',
  };

  return (
    <Box>
      <Link href={'./top'}>
        <Text m={'0px'} p={'12px'} fontSize={'20px'} color={'#777777'}>
          {'< 戻る'}
        </Text>
      </Link>
      <VStack>
        <Box p={'24px'} />
        <Text m={0} fontSize={'24px'}>
          決済確認
        </Text>
        <Spacer />
        <Text m={0} fontSize={'16px'}>
          お金の貸し借りは解消されましたか？
        </Text>
        <Box p={'16px'} />
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
          </VStack>
        </HStack>
        <Spacer />
        <Button
          bgColor={'#1487E2'}
          borderRadius={32}
          size={'lg'}
          m={'20px'}
          type="submit"
          h={12}
        >
          <Text color={'white'} fontSize={'24px'} p={'8px'}>
            決済確認
          </Text>
        </Button>
      </VStack>
    </Box>
  );
};
