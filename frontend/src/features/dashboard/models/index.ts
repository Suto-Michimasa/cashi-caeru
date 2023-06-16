import { CreateLoanRequestBody } from '@/features/loans/types';

export const requestLoanData: CreateLoanRequestBody  = {
  creatorId: 'Uc6ed8bbaaa81cea19b12f98d022c86de',
  description: 'お金を貸してください',
  amount: 2000,
  deadline: new Date(2023, 6, 30),
};
