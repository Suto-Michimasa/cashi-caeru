import * as admin from "firebase-admin";
import { Loan } from "../types/loan";
import { Timestamp } from "firebase-admin/firestore";

// Loanからidを削除した型を定義
export type LoanWithoutId = Omit<Loan, "id">;

// 決済データからFirestoreに保存するデータを作成する
export const createLoanDocData = (
  lenderId: string,
  borrowerId: string,
  description: string,
  amount: number,
  deadline: string | Date,
): LoanWithoutId => {
  // deadlineはDate型で受け取り、Timestamp型に変換する

  // If deadline is a string, convert it to a Date object
  if (typeof deadline === "string") {
    deadline = new Date(deadline);
  }
  return {
    isMarked: false,
    lenderId,
    borrowerId,
    description,
    amount,
    deadline: admin.firestore.Timestamp.fromDate(deadline),
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: null,
  };
};
