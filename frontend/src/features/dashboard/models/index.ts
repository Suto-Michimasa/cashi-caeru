import { CreateLoanRequestBody } from '@/features/loans/types';

export const requestLoanData: CreateLoanRequestBody = {
  borrowerId: 'Ub8f1889965e2fdf915300f6c671d4420',
  lenderId: 'Ucd6450f6f50b65dfa706c18012015039',
  description: 'お金を貸してください',
  amount: 2000,
  deadline: new Date(2023, 6, 30),
};
