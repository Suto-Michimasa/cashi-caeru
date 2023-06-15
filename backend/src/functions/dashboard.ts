import { userCollection, paymentCollection } from "../const/collection";
import { DashboardData, UserData } from "../types/dashboard";

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
    paymentIds = paymentsQuerySnapshot.docs.map((doc) => doc.data().paymentId);
  } else {
    return null;
  }
  const paymentsQuerySnapshot = await paymentCollection.where("paymentId", "in", paymentIds).get();
  const payments = paymentsQuerySnapshot.docs.map((doc) => doc.data());
  const lenPayments = payments.filter((payment) => payment.lenderId === userId);
  const borPayments = payments.filter((payment) => payment.borrowerId === userId);
  // lenPaymentsは、amountをそのまま使う。borrowerIdを取得して、userCollectionからnameとpictureUrlを取得して、newPaymentsに入れる
  const newLenPayments = await Promise.all(
    lenPayments.map(async (payment) => {
      const userQuerySnapshot = await userCollection.where("lineId", "==", payment.borrowerId).get();
      const user = userQuerySnapshot.docs[0].data();
      const userData: UserData = {
        name: user.name,
        pictureUrl: user.pictureUrl,
        amount: payment.amount,
        deadline: payment.deadline,
      };
      return userData;
    })
  );
  // borPaymentsは、amountをマイナスにしてnewPaymentsに入れる．lenderIdを取得して、userCollectionからnameとpictureUrlを取得して、newPaymentsに入れる
  const newBorPayments = await Promise.all(
    borPayments.map(async (payment) => {
      const userQuerySnapshot = await userCollection.where("lineId", "==", payment.lenderId).get();
      const user = userQuerySnapshot.docs[0].data();
      const userData: UserData = {
        name: user.name,
        pictureUrl: user.pictureUrl,
        amount: -payment.amount,
        deadline: payment.deadline,
      };
      return userData;
    })
  );
  const newPayments = newLenPayments.concat(newBorPayments);
  const totalBalance = lenPayments.reduce((sum, payment) => sum + payment.amount, 0) - borPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const dashboardData: DashboardData = {
    totalBalance: totalBalance,
    payments: newPayments,
  };
  return dashboardData;
};
