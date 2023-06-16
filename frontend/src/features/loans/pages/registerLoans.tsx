import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import React, { ChangeEvent, useState } from 'react';

export const RegisterLoans = () => {
  const lenderId = '007';
  const borrowerId = '008';

  const router = useRouter();

  const [type, setType] = useState<'lend' | 'borrow'>('lend');
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<number>();
  const [deadline, setDeadline] = useState<Date | null>(null);

  const onSubmit = () => {
    console.log({
      type: type,
      description: description,
      amount: amount,
      deadline: deadline,
    });
  };
  return (
    <Box>
      <Link href={'./top'}>
        <Text m={'0px'} p={'12px'} fontSize={'20px'} color={'#777777'}>
          {'< 戻る'}
        </Text>
      </Link>
      <form>
        <VStack spacing={'32px'}>
          <FormControl w={'80vw'} p={'20px'}>
            <RadioGroup onChange={() => setType} size={'lg'} name="isLend">
              <Stack direction="row" justify={'center'} spacing={'64px'}>
                <Radio value="lend" colorScheme="blue">
                  <Text fontSize={'20px'} color={'#1487E2'}>
                    貸す
                  </Text>
                </Radio>
                <Radio value="borrow" colorScheme="red">
                  <Text fontSize={'20px'} color={'#FF334B'}>
                    借りる
                  </Text>
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <FormControl w={'80vw'}>
            <FormLabel fontSize={'28px'}>決済名</FormLabel>
            <Input
              onChange={() => setDescription}
              variant={'flushed'}
              fontSize={'28px'}
              textAlign={'right'}
              size={'lg'}
              name="description"
            />
          </FormControl>
          <FormControl w={'80vw'}>
            <FormLabel fontSize={'28px'}>金額</FormLabel>
            <InputGroup>
              <Input
                onChange={() => setAmount}
                variant={'flushed'}
                fontSize={'28px'}
                textAlign={'right'}
                size={'lg'}
                name="amount"
                type="number"
              />
              <InputRightElement fontSize={'28px'}>
                <text>円</text>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl w={'80vw'}>
            <FormLabel fontSize={'28px'}>期限</FormLabel>
            <Input
              type="date"
              onChange={() => setDeadline}
              variant={'flushed'}
              fontSize={'28px'}
              textAlign={'right'}
              size={'lg'}
              name="deadline"
            />
          </FormControl>
          <Button
            bgColor={'#1487E2'}
            borderRadius={32}
            size={'lg'}
            m={'20px'}
            type="submit"
            h={16}
          >
            <Text color={'white'} fontSize={'28px'} p={'20px'}>
              友達に送信
            </Text>
          </Button>
        </VStack>
      </form>
    </Box>
  );
};
