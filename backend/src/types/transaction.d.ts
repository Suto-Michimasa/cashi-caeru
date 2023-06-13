type Transaction = {
  id: string; // transactionのid
  borrower_id: string; // 借りた人のline_id
  lender_id: string; // 貸した人のline_id
  amount: number; // 金額
  createdAt: Date; // 作成日
  deadline: Date // 締切
};
