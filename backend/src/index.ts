import { functions } from "./plugins/firebase";
import { loanCollection, paymentCollection, userCollection } from "./const/collection";
import { createUserDocumentFunction, createLoanDocData, createPaymentDocData } from "./functions";

import { AddLoanRequestBody } from "./types/loan";
import { CreateUserPayload } from "./types/user";
import { PaymentRequestBody } from "./types/payment";


// ユーザ作成
// - line_idが存在する場合には作成しない
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
    const { loanId, lenderId, borrowerId, amount, deadline } = data;
    const paymentDocData = createPaymentDocData(lenderId, borrowerId, amount, deadline);
    const paymentDocRef = await paymentCollection.add(paymentDocData);
    await paymentDocRef.collection("loans").add({ loanId });
    return { message: "success" };
  }
);

// ********************
// 決済作成
// - loansにテーブルを追加
// - paymentsに既に貸し借りが存在しているかを確認。存在していない場合は新規作成
// - 存在してる場合は、paymentsのamount, lenderId, borrowerId, deadlineを更新
// ********************
// CHECK: もしもpaymentsのロジックがおかしかったら、引数に明示的な指定が必要かどうかを確認する．
export const createLoan = functions.https.onCall(
  async (data: AddLoanRequestBody) => {
    const { borrowerId, lenderId, description, amount, deadline } = data;
    const loanDocData = createLoanDocData(borrowerId, lenderId, description, amount, deadline);
    // loansにテーブルを追加して、loanIdを取得
    const loanDocRef = await loanCollection.add(loanDocData);
    const loanId = loanDocRef.id;

    // 既に貸し借りが存在しているかを確認
    const paymentDoc = await paymentCollection
      .where("lenderId", "==", lenderId || borrowerId)
      .where("borrowerId", "==", borrowerId || lenderId)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          return null;
        }
        return snapshot.docs[0];
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
    const paymentDocData = paymentDoc?.data();
    const paymentDocId = paymentDoc?.id;
    if (!paymentDocData || !paymentDocId) {
      // 貸し借りが存在しない場合は新規作成
      const paymentDocData = createPaymentDocData(lenderId, borrowerId, amount, deadline);
      const paymentDocRef = await paymentCollection.add(paymentDocData);
      await paymentDocRef.collection("loans").add({ loanId });
      // ユーザーの貸し借りにloanIdを追加
      await userCollection.doc(lenderId).collection("loans").add({ loanId });
      await userCollection.doc(borrowerId).collection("loans").add({ loanId });
      return { message: "success" };
    } else {
      // 貸し借りが存在する場合は更新
      const { amount: paymentAmount, lenderId: paymentLenderId, borrowerId: paymentBorrowerId } = paymentDocData;
      const newDeadline = deadline;
      const newAmount = paymentAmount + amount;
      const isLender = lenderId === paymentLenderId;
      // newAmountが正の時は、amountだけ更新
      if (isLender) {
        // paymentsのlenderId === req.lenderIdのとき
        //    new payments.amount = payments.amount + req.amount
        //    payment_idが一致するデータを書き換え
        const targetPaymentDocRef = paymentCollection.doc(paymentDocId);
        await targetPaymentDocRef.update({ amount: newAmount, deadline: newDeadline });
        await targetPaymentDocRef.collection("loans").add({ loanId });
        return { message: "success" };
      } else {
        if (newAmount > 0) {
          const newPaymentDocData = createPaymentDocData(paymentLenderId, paymentBorrowerId, newAmount, newDeadline);
          const targetPaymentDocRef = paymentCollection.doc(paymentDocId);
          await targetPaymentDocRef.update(newPaymentDocData);
          await targetPaymentDocRef.collection("loans").add({ loanId });
          return { message: "success" };
        } else {
          // 負の時は、以下を更新
          // payment.lenderId = req.lenderId
          // payment.borrowerId = req.borrowerId
          // 負になっているamountを正にする
          // payment.amount = amount
          const newPaymentDocData = createPaymentDocData(paymentBorrowerId, paymentLenderId, -newAmount, newDeadline);
          const targetPaymentDocRef = paymentCollection.doc(paymentDocId);
          await targetPaymentDocRef.update(newPaymentDocData);
          await targetPaymentDocRef.collection("loans").add({ loanId });
          return { message: "success" };
        }
      }
    }
  }
);
