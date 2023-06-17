import { Timestamp } from "./firebase";

interface Loan {
  id: string; // loanのid
  status: "wait" | "processing" | "finish"; // 取引が完了したかどうか(最初はfalse)
  creatorId: string; // 作成した人のline_id
  description: string; // 決済名
  amount: number; // 金額
  createdAt: Timestamp; // 作成日
  updatedAt: Timestamp | null; // 更新日
  deadline: Timestamp // 締切
}

// addLoanのrequest body
interface AddLoanRequestBody {
  creatorId: string; // 作成した人のline_id
  description: string; // 決済名
  amount: number; // 金額
  deadline: string | Date // 締切
}

interface UpdateLoanRequestBody {
  loanId: string; // 貸し借りのid
  partnerId: string; // 相手のline_id
}

interface GetLoansDetailRequestBody {
  userId: string; // ユーザーのline_id
  paymentId: string; // 貸し借りのid
}

interface LoanDescription {
  loanId: string; // 貸し借りのid
  description: string; // 決済名
  amount: number; // 金額
  createdAt: Date; // 作成日
}

interface LoansDetail {
  name: string; // 相手の名前
  pictureUrl: string; // 相手のプロフィール画像
  amount: number; // 金額
  deadline: Date; // 締切
  loans: LoanDescription[]; // 貸し借りの詳細
}
