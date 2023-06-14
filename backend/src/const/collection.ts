import { db } from "../plugins/firebase";

export const userCollection = db.collection("users"); // ユーザー
export const reservationCollection = db.collection("transactions"); // 決済コレクション
export const noticeCollection = db.collection("notice"); // リマインダーコレクション
export const loanCollection = db.collection("loans"); // 貸し借りコレクション
