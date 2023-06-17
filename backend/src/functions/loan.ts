import { loanCollection, paymentCollection, userCollection } from "../const/collection";
import { Loan, LoansDetail, GetLoansDetailRequestBody, LoanDescription } from "../types/loan";
import { Timestamp } from "firebase-admin/firestore";
import { timestampToDate } from "../utils/timestamp";

// Loanからidを削除した型を定義
export type LoanWithoutId = Omit<Loan, "id">;

// 決済データからFirestoreに保存するデータを作成する
export const createLoanDocData = (
  creatorId: string,
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
    status: "wait",
    creatorId,
    description,
    amount,
    deadline: Timestamp.fromDate(deadline),
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: null,
  };
};

export const updateLoan = async ( loanId: string ) => {
  await loanCollection.doc(loanId).update({
    status: "processing",
    updatedAt: Timestamp.fromDate(new Date()),
  });
};


// 貸し借り詳細情報表示APIのデータ作成
// request bodyはuserIdとloanIdを受けとる
// paymentIdを受け取り、そのpaymentIdに紐づくpaymentTableのsubcollectionのloanのデータ(statusがprocessing)を取得する
// loansは、 createdAtの降順でソートする
// amountはpaymentのamountを取得する
// deadlineはpaymentのdeadlineを取得する
export const getLoansDetail = async (
  requestBody: GetLoansDetailRequestBody
): Promise<LoansDetail> => {
  const { userId, paymentId } = requestBody;
  const paymentDoc = await paymentCollection.doc(paymentId).get();
  const paymentData = paymentDoc.data();
  if (!paymentData) {
    throw new Error("payment not found");
  }
  const { amount, deadline, creatorId, partnerId } = paymentData;
  // paymentsのsub collection中にあるloanIdをすべて取得
  const loansSnapshot = await paymentCollection.doc(paymentId).collection("loans").get();
  const loanIds = loansSnapshot.docs.map((doc) => doc.data().loanId);
  // loanIdsを使って、ドキュメントidが一致するloansのデータを取得する。
  const loans = (await Promise.all(
    loanIds.map(async (loanId) => {
      const loanDoc = await loanCollection.doc(loanId).get();
      const loanData = loanDoc.data();
      if (!loanData) {
        throw new Error("loan not found");
      }
      const { description, amount, createdAt, status } = loanData;
      console.log("createdAt", createdAt);
      if (status !== "processing") {
        return null;
      }
      return {
        loanId: loanId,
        description: description,
        amount: amount,
        createdAt: timestampToDate(createdAt),
      };
    })
  )).filter((loan) => loan !== null) as LoanDescription[];
  // statusがprocessingのものだけ取得する。createdAtの降順でソートする
  const processingLoans = loans
    .sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return -1;
      } else {
        return 1;
      }
    });
  // creatorIdとpartnerIdのうちuserIdと一致しないユーザのnameとpictureUrlを取得する
  const partnerIdForQuery = userId === creatorId ? partnerId : creatorId;
  const userDoc = await userCollection.where("lineId", "==", partnerIdForQuery).get();
  const userData = userDoc.docs[0].data();
  if (!userData) {
    throw new Error("user not found");
  }
  const { name, pictureUrl } = userData;
  return {
    name: name,
    pictureUrl: pictureUrl,
    amount: amount,
    loans: processingLoans,
    deadline: timestampToDate(deadline),
  };
};
