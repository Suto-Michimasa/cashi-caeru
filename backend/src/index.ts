import { config, functions } from "./plugins/firebase";
import { loanCollection, paymentCollection, userCollection } from "./const/collection";
import { createUserDocumentFunction, createLoanDocData, createPaymentDocData, createDashboardData, finishLoan, getLoansDetail } from "./functions";

import { AddLoanRequestBody, UpdateLoanRequestBody, GetLoansDetailRequestBody } from "./types/loan";
import { CreateUserPayload } from "./types/user";
import { PaymentRequestBody } from "./types/payment";
import { timestampToDate } from "./utils/timestamp";

import { generateMessage } from "./functions/linebot";
import axios from "axios";
import * as corsLib from "cors";
const cors = corsLib();
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
    await loanCollection.add(loanDocData);
    // const loanDocRef = await loanCollection.add(loanDocData);
    // 作成したloanのidを取得
    // const loanId = loanDocRef.id;
    // 選択した友達に送るURLを作成
    // const url = `https://liff.line.me/1656091279-2Q0XqZ3o?loanId=${loanId}`;
  }
);

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
      const newDeadline = timestampToDate(deadline);
      const paymentDocData = createPaymentDocData(creatorId, partnerId, amount, newDeadline);
      const paymentDocRef = await paymentCollection.add(paymentDocData);
      const newPaymentDocId = paymentDocRef.id;
      await paymentDocRef.collection("loans").add({ loanId: loanId });

      const updateUserPaymentCollection = async (userId: string, paymentDocId: string) => {
        const userDocRef = await userCollection.where("lineId", "==", userId).get();
        const userDocId = userDocRef.docs[0].id;
        await userCollection.doc(userDocId).collection("payments").add({ paymentDocId });
      };
      // loansのstatusをprocessingに更新
      await loanCollection.doc(loanId).update({ status: "processing" });
      // Userテーブルにpaymentsを追加
      await updateUserPaymentCollection(creatorId, newPaymentDocId);
      await updateUserPaymentCollection(partnerId, newPaymentDocId);
      return { message: "success" };
    } else {
      // 既にpaymentsに貸し借りが存在している場合は、amount, deadlineを更新
      // amountは、
      const { amount: paymentAmount, creatorId: creatorId, partnerId: partnerId } = paymentDocData;
      const newDeadline = timestampToDate(deadline);
      console.log("newDeadline", newDeadline);
      const newAmount = paymentAmount + amount;

      const targetPaymentDocRef = paymentCollection.doc(paymentDocId);
      const newPaymentDocData = createPaymentDocData(creatorId, partnerId, newAmount, newDeadline);
      await targetPaymentDocRef.update(newPaymentDocData);
      await targetPaymentDocRef.collection("loans").add({ loanId });
      // loansのstatusをprocessingに更新
      await loanCollection.doc(loanId).update({ status: "processing" });
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
export const sendReminder = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const creditorName = req.body.creditorName; // 債権者の名前
    const eventName = req.body.eventName; // イベント名
    const daysRemaining = req.body.daysRemaining; // 残り日数
    // const debtorId = req.body.debtorId; // 債務者のLINEユーザーID
    console.log("ikkaime");
    const text = await generateMessage(creditorName, eventName, daysRemaining); // メッセージを生成する関数
    const lineMessage = {
      "to": "Ucd6450f6f50b65dfa706c18012015039",
      "messages": [
        {
          "type": "text",
          "text": text.content,
        },
      ],
    };
    console.log("text", text);

    const LINE_MESSAGING_API = "https://api.line.me/v2/bot/message/push";
    const LINE_HEADER = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.line.channel_access_token}`,
    };

    await axios.post(LINE_MESSAGING_API, lineMessage, { headers: LINE_HEADER });
    // res.sendStatus(200);
    return;
  });
});

// ********************
// 貸し借り詳細データ取得
// ********************
export const getLoanDetailData = functions.https.onCall(
  async (req: GetLoansDetailRequestBody) => {
    const loanDetailData = await getLoansDetail(req);
    return loanDetailData;
  }
);
