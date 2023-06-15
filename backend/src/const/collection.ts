import { db } from "../plugins/firebase";

export const userCollection = db.collection("users"); // ユーザー
export const paymentCollection = db.collection("payments"); // 貸し借りコレクション
export const noticeCollection = db.collection("reminders"); // リマインダーコレクション
export const loanCollection = db.collection("loans"); // 決済コレクション
