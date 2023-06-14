import { CreateLoanRequestBody } from "@/features/loans/types";

export const requestLoanData: CreateLoanRequestBody  = {
  borrowerId: 'U1234567890',
  lenderId: 'U0987654321',
  description: 'お金を貸してください',
  amount: 1000,
  deadline: new Date(),
};
