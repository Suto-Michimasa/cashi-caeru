import { Timestamp } from "firebase-admin/firestore";

type Transaction = {
  id: string; // transactionのid
  is_marked: boolean; // 取引が完了したかどうか(最初はfalse)
  borrower_id: string; // 借りた人のline_id
  lender_id: string; // 貸した人のline_id
  description: string; // 決済名
  amount: number; // 金額
  createdAt: Timestamp; // 作成日
  updatedAt: Timestamp; // 更新日
  deadline: Date // 締切
};
