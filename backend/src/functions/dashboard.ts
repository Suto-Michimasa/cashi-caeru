import { userCollection, paymentCollection } from "../const/collection";
import { DashboardData, UserData } from "../types/dashboard";
import { Payment } from "../types/payment";

// ********************
// ダッシュボードデータ取得
// ①Users collectionからlineIdと一致するuserを取得する
// ②Users のsub collection であるpaymentsのフィールドにあるpaymentIdをすべて取得する
// ⑥totalBalance =  ④のamountsの合計 - ⑤のamountsの合計
// ⑦lenPayments, borPayments, noPayments, totalBalanceをDashboardDataに格納する
// ⑧DashboardDataを返す
// ********************

export const createDashboardData = async (
  userId: string
): Promise<DashboardData | null> => {
  const userQuerySnapshot = await userCollection.where("lineId", "==", userId).get();
  let paymentIds = [];
  if (!userQuerySnapshot.empty) {
    const userRef = userQuerySnapshot.docs[0].ref;
    const paymentsQuerySnapshot = await userRef.collection("payments").get();
    paymentIds = paymentsQuerySnapshot.docs.map((doc) => doc.data().paymentDocId);
  } else {
    return null;
  }
  // paymentIdsを使って、payments collectionからドキュメントIDと一致するドキュメントを取得する
  if (paymentIds.length === 0) {
    return null;
  }
  const paymentsProcess = paymentIds.map(async (paymentId) => {
    const paymentQuerySnapshot = await paymentCollection.doc(paymentId).get();
    const paymentData = paymentQuerySnapshot.data();
    return paymentData ? paymentData as Payment : null;
  });
  const payments: (Payment | null)[] = await Promise.all(paymentsProcess);
  const validPayments = payments.filter((payment) => payment !== null) as Payment[];
  if (validPayments.length === 0) {
    return null;
  }
  // paymentsの整形。deadlineとamountはそのまま使う。
  // creatorId, partnerIdのうち自分でない方を取得して、users collectionからnameとpictureUrlを取得する。
  const newPayments = validPayments.map(async (payment) => {
    const { creatorId, partnerId } = payment;
    const targetId = creatorId === userId ? partnerId : creatorId;
    const userQuerySnapshot = await userCollection.where("lineId", "==", targetId).get();
    const userData = userQuerySnapshot.docs[0].data();
    const { name, pictureUrl } = userData;
    return {
      deadline: payment.deadline,
      amount: payment.amount,
      name: name,
      pictureUrl: pictureUrl,
    } as UserData;
  });

  const totalBalance = validPayments.reduce((acc, payment) => {
    if (payment.creatorId === userId) {
      return acc + payment.amount;
    } else {
      return acc - payment.amount;
    }
  }, 0);


  const dashboardData: DashboardData = {
    totalBalance: totalBalance,
    payments: await Promise.all(newPayments),
  };
  return dashboardData;
};
