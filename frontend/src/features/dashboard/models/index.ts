import { CreateLoanRequestBody } from "@/features/loans/types";

export const requestLoanData: CreateLoanRequestBody  = {
  borrowerId: 'Uc6ed8bbaaa81cea19b12f98d022c86de',
  lenderId: 'Ucd6450f6f50b65dfa706c18012015039',
  description: 'お金を貸してください',
  amount: 2000,
  deadline: new Date(2023, 6, 30)
};
