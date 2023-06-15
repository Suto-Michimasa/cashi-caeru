import { Timestamp } from "firebase-admin/firestore";
import { Payment } from "../types/payment";

export type PaymentWithoutId = Omit<Payment, "paymentId">;

export const createPaymentDocData = (
  lenderId: string,
  borrowerId: string,
  amount: number,
  deadline: string | Date,
): PaymentWithoutId => {
  // deadlineはDate型で受け取り、Timestamp型に変換する
  if (typeof deadline === "string") {
    deadline = new Date(deadline);
  }
  return {
    lenderId,
    borrowerId,
    amount,
    deadline: Timestamp.fromDate(deadline),
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: null,
  };
};

