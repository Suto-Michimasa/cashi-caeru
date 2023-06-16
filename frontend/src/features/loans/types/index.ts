export type CreateLoanRequestBody = {
  creatorId: string; // 決済を作成した人のline_id
  description: string; // 決済名
  amount: number; // 金額
  deadline: Date // 締切
}

export type UpdateLoanRequestBody = {
  partnerId: string; // もう1人のline_id
  loanId: string; // loanのid
}
