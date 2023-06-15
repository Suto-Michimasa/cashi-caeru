import { functions } from "./plugins/firebase";
import { loanCollection, paymentCollection, userCollection } from "./const/collection";
import { createUserDocumentFunction, createLoanDocData, createPaymentDocData, updateLoanIsMarked } from "./functions";

import { AddLoanRequestBody } from "./types/loan";
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
// TODO: もしもpaymentsのロジックがおかしかったら、引数に明示的な指定が必要かどうかを確認する．
export const createLoan = functions.https.onCall(
  async (data: AddLoanRequestBody) => {
    const { borrowerId, lenderId, description, amount, deadline } = data;
    const loanDocData = createLoanDocData(borrowerId, lenderId, description, amount, deadline);
    const loanDocRef = await loanCollection.add(loanDocData);
    const loanId = loanDocRef.id;

    const findPaymentDoc = async () => {
      const snapshot = await paymentCollection
        .where("lenderId", "==", lenderId || borrowerId)
        .where("borrowerId", "==", borrowerId || lenderId)
        .get();

      return snapshot.empty ? null : snapshot.docs[0];
    };

    const paymentDoc = await findPaymentDoc();
    const paymentDocData = paymentDoc?.data();
    const paymentDocId = paymentDoc?.id;

    const updateUserLoanCollection = async (userId: string) => {
      const userDocRef = await userCollection.where("lineId", "==", userId).get();
      const userDocId = userDocRef.docs[0].id;
      await userCollection.doc(userDocId).collection("payments").add({ paymentDocId });
    };

    if (!paymentDocData || !paymentDocId) {
      const paymentDocData = createPaymentDocData(lenderId, borrowerId, amount, deadline);
      const paymentDocRef = await paymentCollection.add(paymentDocData);
      await paymentDocRef.collection("loans").add({ loanId });
      await updateUserLoanCollection(lenderId);
      await updateUserLoanCollection(borrowerId);
      return { message: "success" };
    } else {
      const { amount: paymentAmount, lenderId: paymentLenderId, borrowerId: paymentBorrowerId } = paymentDocData;
      const newDeadline = deadline;
      const newAmount = paymentAmount + amount;
      const isLender = lenderId === paymentLenderId;
      const targetPaymentDocRef = paymentCollection.doc(paymentDocId);

      if (isLender || newAmount > 0) {
        const newPaymentDocData = createPaymentDocData(paymentLenderId, paymentBorrowerId, newAmount, newDeadline);
        await targetPaymentDocRef.update(newPaymentDocData);
        await targetPaymentDocRef.collection("loans").add({ loanId });
        return { message: "success" };
      } else {
        const newPaymentDocData = createPaymentDocData(paymentBorrowerId, paymentLenderId, -newAmount, newDeadline);
        await targetPaymentDocRef.update(newPaymentDocData);
        await targetPaymentDocRef.collection("loans").add({ loanId });
        return { message: "success" };
      }
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
    await updateLoanIsMarked(paymentId);
    return { message: "success" };
  }
);
