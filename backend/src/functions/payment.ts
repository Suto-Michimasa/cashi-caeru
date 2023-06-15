import { Timestamp } from "firebase-admin/firestore";
import { Payment } from "../types/payment";
import { loanCollection, paymentCollection } from "../const/collection";

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


export const updateLoanIsMarked = async (
  paymentId: string
): Promise<void> => {
  // loans collectionのフィールドの中にあるloanIdをすべて取得
  const loansSnapshot = await paymentCollection.doc(paymentId).collection("loans").get();
  const loanIds = loansSnapshot.docs.map((doc) => doc.data().loanId);
  await Promise.all(
    loanIds.map((loanId) =>
      loanCollection.doc(loanId).update({ isMarked: true })
    )
  );
  // paymentのamountを0、updatedAtを現在時刻にする
  await paymentCollection.doc(paymentId).update({
    amount: 0,
    updatedAt: Timestamp.fromDate(new Date()),
  });
};
