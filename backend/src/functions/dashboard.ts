import { userCollection, paymentCollection } from "../const/collection";
import { DashboardData, UserData } from "../types/dashboard";

// ********************
// ダッシュボードデータ取得
// ①Users collectionからlineIdと一致するuserを取得する
// ②Users のsub collection であるpaymentsのフィールドにあるpaymentIdをすべて取得する

// ④paymentのうちamountsが0のものをnoPaymentsに追加
// ④amountsが0でないかつpaymentsの中からborrowerIdとuserIdが一致するpaymentsのamountとdeadlineを取得する、
//     さらにlenderIdと一致するuserをusersテーブルで検索をかけ、一致したuserのnameとpictureUrlを取得する
//     → borPaymentsに追加
// ⑤amountsが0でないかつpaymentsの中からlenderIdとuserIdが一致するpaymentsのamountとdeadlineを取得する、
//     さらにborrowerIdと一致するuserをusersテーブルで検索をかけ、一致したuserのnameとpictureUrlを取得する
//     → lenPaymentsに追加
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

  const noPayments: UserData[] = payments.filter((payment) => payment.amount === 0).map((payment) => {
    const name = payment.borrowerId === userId ? payment.lenderName : payment.borrowerName;
    const pictureUrl = payment.borrowerId === userId ? payment.lenderPictureUrl : payment.borrowerPictureUrl;
    return {
      amount: payment.amount,
      deadline: payment.deadline,
      name: name,
      pictureUrl: pictureUrl,
    };
  });
  const borPayments = payments.filter((payment) => payment.amount !== 0 && payment.borrowerId === userId);
  const borPaymentsData: UserData[] = await Promise.all(borPayments.map(async (payment) => {
    const lenderQuerySnapshot = await userCollection.where("lineId", "==", payment.lenderId).get();
    const lender = lenderQuerySnapshot.docs[0].data();
    return {
      amount: payment.amount,
      deadline: payment.deadline,
      name: lender.name,
      pictureUrl: lender.pictureUrl,
    };
  }));

  const lenPayments = payments.filter((payment) => payment.amount !== 0 && payment.lenderId === userId);
  const lenPaymentsData: UserData[] = await Promise.all(lenPayments.map(async (payment) => {
    const borrowerQuerySnapshot = await userCollection.where("lineId", "==", payment.borrowerId).get();
    const borrower = borrowerQuerySnapshot.docs[0].data();
    return {
      amount: payment.amount,
      deadline: payment.deadline,
      name: borrower.name,
      pictureUrl: borrower.pictureUrl,
    };
  }));

  const totalBalance = lenPayments.reduce((sum, payment) => sum + payment.amount, 0) - borPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const dashboardData: DashboardData = {
    totalBalance: totalBalance,
    lenPayments: lenPaymentsData,
    borPayments: borPaymentsData,
    noPayments: noPayments,
  };
  return dashboardData;
};
