

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
  deadline: Date
): LoanWithoutId => {
  // deadlineはDate型で受け取り、Timestamp型に変換する

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
