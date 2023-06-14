export type CreateLoanRequestBody = {
  lenderId: string; // 貸した人のline_id
  borrowerId: string; // 借りた人のline_id
  description: string; // 決済名
  amount: number; // 金額
  deadline: Date // 締切
}
