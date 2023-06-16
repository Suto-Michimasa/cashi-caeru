import { Timestamp } from "./firebase";

interface Payment {
  paymentId: string; // paymentのid
  creatorId: string; // 合計借りている人のline_id
  partnerId: string; // 合計貸している人のline_id
  amount: number; // 金額(プラスはcreatorが貸している、マイナスは借りている)
  createdAt: Timestamp; // 作成日
  updatedAt: Timestamp | null; // 更新日
  markedAt: Timestamp | null;
  deadline: Timestamp // 締切
}

// addPaymentとupdatePaymentのrequest body
interface PaymentRequestBody {
  loanId: string; // 貸し借りのid
  creatorId: string; // 貸した人のline_id
  partnerId: string; // 借りた人のline_id
  amount: number; // 金額
  deadline: string | Date // 締切
}

