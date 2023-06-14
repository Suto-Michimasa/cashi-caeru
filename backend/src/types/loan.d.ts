import { Timestamp } from "./firebase";

interface Loan {
  id: string; // loanのid
  isMarked: boolean; // 取引が完了したかどうか(最初はfalse)
  borrowerId: string; // 借りた人のline_id
  lenderId: string; // 貸した人のline_id
  description: string; // 決済名
  amount: number; // 金額
  createdAt: Timestamp; // 作成日
  updatedAt: Timestamp | null; // 更新日
  deadline: Timestamp // 締切
}

// addLoanのrequest body
interface AddLoanRequestBody {
  lenderId: string; // 貸した人のline_id
  borrowerId: string; // 借りた人のline_id
  description: string; // 決済名
  amount: number; // 金額
  deadline: string | Date // 締切
}
