export type GetLoanDetailRequestBody = {
  paymentId: string; // loanのid
  userId: string; // line_id
}

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
export type SendReminderRequestBody = {
  eventName: string; // 貸借イベント名
  creditorName: string; // 債権者の名前
  daysRemaining: number; // 返済猶予期日
}
