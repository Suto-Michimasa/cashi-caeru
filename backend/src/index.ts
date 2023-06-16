import { functions } from "./plugins/firebase";
import { loanCollection, paymentCollection, userCollection } from "./const/collection";
import { createUserDocumentFunction, createLoanDocData, createPaymentDocData, createDashboardData, finishLoan } from "./functions";

import { AddLoanRequestBody, UpdateLoanRequestBody } from "./types/loan";
import { CreateUserPayload } from "./types/user";
import { PaymentRequestBody } from "./types/payment";

// ********************
// ユーザ作成
// - line_idが存在する場合には作成しない
// ********************
export const createUser = functions.https.onCall(async (data: CreateUserPayload) => {
  const userDocData = await createUserDocumentFunction(data);
  if (!userDocData) {
    return { message: "already exists" };
  }
  await userCollection.add(userDocData);
  return { message: "success" };
});

export const createPayment = functions.https.onCall(
  async (data: PaymentRequestBody) => {
    const { loanId, creatorId, partnerId, amount, deadline } = data;
    const paymentDocData = createPaymentDocData(creatorId, partnerId, amount, deadline);
    const paymentDocRef = await paymentCollection.add(paymentDocData);
    await paymentDocRef.collection("loans").add({ loanId });
    return { message: "success" };
  }
);

// ********************
// 決済作成
// - loansにテーブルを追加
// - 存在してる場合は、paymentsのamount, lenderId, borrowerId, deadlineを更新
// ********************
// TODO: もしもpaymentsのロジックがおかしかったら、引数に明示的な指定が必要かどうかを確認する．
export const createLoan = functions.https.onCall(
  async (data: AddLoanRequestBody) => {
    const { creatorId, description, amount, deadline } = data;
    const loanDocData = createLoanDocData(creatorId, description, amount, deadline);
    const loanDocRef = await loanCollection.add(loanDocData);
    // 作成したloanのidを取得
    // const loanId = loanDocRef.id;
    // 選択した友達に送るURLを作成
    // const url = `https://liff.line.me/1656091279-2Q0XqZ3o?loanId=${loanId}`;
  }
);

// TODO: lenderIdとpartnerIdを検索して、修正
// ********************
// 取引相手を追加・paymentの作成
// - paymentsに既に貸し借りが存在しているかを確認。存在していない場合は新規作成
// - 存在してる場合は、paymentsのamount, deadlineを更新
// ********************
export const updateLoan = functions.https.onCall(
  async (data: UpdateLoanRequestBody) => {
    const { loanId, partnerId } = data;
    // loanIdからloanDocを取得、creatorIdと、amountとdeadlineを取得
    const loanDocRef = await loanCollection.doc(loanId).get();
    const loanDocData = loanDocRef.data();
    // loanDocDataが存在しない場合はエラーを返す
    if (!loanDocData) {
      return { message: "error" };
    }
    const { creatorId, amount, deadline } = loanDocData;

    // 既にpaymentsに貸し借りが存在しているかを確認
    const findPaymentDoc = async () => {
      const snapshot1 = await paymentCollection
        .where("creatorId", "==", creatorId)
        .where("partnerId", "==", partnerId)
        .get();
      if (!snapshot1.empty) {
        return snapshot1.docs[0];
      }
      const snapshot2 = await paymentCollection
        .where("creatorId", "==", partnerId)
        .where("partnerId", "==", creatorId)
        .get();
      if (!snapshot2.empty) {
        return snapshot2.docs[0];
      }
      return null;
    };

    const paymentDoc = await findPaymentDoc();
    const paymentDocData = paymentDoc?.data();
    const paymentDocId = paymentDoc?.id;

    if (!paymentDocData || !paymentDocId) {
      // paymentsに貸し借りが存在していない場合は新規作成
      // loansにデータを追加
      const paymentDocData = createPaymentDocData(creatorId, partnerId, amount, deadline);
      const paymentDocRef = await paymentCollection.add(paymentDocData);
      const newPaymentDocId = paymentDocRef.id;
      await paymentDocRef.collection("loans").add({ loanId: loanId });

      const updateUserPaymentCollection = async (userId: string, paymentDocId: string) => {
        const userDocRef = await userCollection.where("lineId", "==", userId).get();
        const userDocId = userDocRef.docs[0].id;
        await userCollection.doc(userDocId).collection("payments").add({ paymentDocId });
      };
      // Userテーブルにpaymentsを追加
      await updateUserPaymentCollection(creatorId, newPaymentDocId);
      await updateUserPaymentCollection(partnerId, newPaymentDocId);
      return { message: "success" };
    } else {
      // 既にpaymentsに貸し借りが存在している場合は、amount, deadlineを更新
      // amountは、
      const { amount: paymentAmount, creatorId: creatorId, partnerId: partnerId } = paymentDocData;
      const newDeadline = deadline;
      const newAmount = paymentAmount + amount;

      const targetPaymentDocRef = paymentCollection.doc(paymentDocId);
      const newPaymentDocData = createPaymentDocData(creatorId, partnerId, newAmount, newDeadline);
      await targetPaymentDocRef.update(newPaymentDocData);
      await targetPaymentDocRef.collection("loans").add({ loanId });
      return { message: "success" };
    }
  }
);

// ********************
// 決済完了
// - loansのisMarkedをtrueにする
// - paymentsのamountを0にする
// ********************
export const completePayment = functions.https.onCall(
  async (data: { paymentId: string }) => {
    const { paymentId } = data;
    await finishLoan(paymentId);
    return { message: "success" };
  }
);

// ********************
// ダッシュボードデータ取得
// ********************
export const getDashboardData = functions.https.onCall(
  async (data: { userId: string }) => {
    const { userId } = data;
    const dashboardData = await createDashboardData(userId);
    return dashboardData;
  }
);
