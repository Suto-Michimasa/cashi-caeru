import { Timestamp } from "./firebase";

interface Payment {
  paymentId: string; // paymentのid
  borrowerId: string; // 合計借りている人のline_id
  lenderId: string; // 合計貸している人のline_id
  amount: number; // 金額
  createdAt: Timestamp; // 作成日
  updatedAt: Timestamp | null; // 更新日
  deadline: Timestamp // 締切
}

// addPaymentとupdatePaymentのrequest body
interface PaymentRequestBody {
  loanId: string; // 貸し借りのid
  lenderId: string; // 貸した人のline_id
  borrowerId: string; // 借りた人のline_id
  amount: number; // 金額
  deadline: string | Date // 締切
}

