import { Timestamp } from "firebase-admin/firestore";
import { Payment } from "../types/payment";
import { loanCollection, paymentCollection } from "../const/collection";

export type PaymentWithoutId = Omit<Payment, "paymentId">;


// creatorIdとpartnerIdとlenderIdとborrowerIdの4つの引数を受け取る
export const createPaymentDocData = (
  creatorId: string,
  partnerId: string,
  amount: number,
  deadline: string | Date,
): PaymentWithoutId => {
  // deadlineはDate型で受け取り、Timestamp型に変換する
  if (typeof deadline === "string") {
    deadline = new Date(deadline);
  }
  return {
    creatorId,
    partnerId,
    amount,
    deadline: Timestamp.fromDate(deadline),
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: null,
    markedAt: null,
  };
};


export const finishLoan = async (
  paymentId: string
): Promise<void> => {
  // loans collectionのフィールドの中にあるloanIdをすべて取得
  const loansSnapshot = await paymentCollection.doc(paymentId).collection("loans").get();
  const loanIds = loansSnapshot.docs.map((doc) => doc.data().loanId);

  // Check if loanIds array has any invalid values
  const hasInvalidIds = loanIds.some((id) => !id || typeof id !== "string");
  if (hasInvalidIds) {
    throw new Error("Invalid loanId found");
  }
  await Promise.all(
    loanIds.map((loanId) =>
      loanCollection.doc(loanId).update({ status: "finish" })
    )
  );
  // paymentのamountを0、updatedAtを現在時刻にする
  await paymentCollection.doc(paymentId).update({
    amount: 0,
    markedAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
  });
};
