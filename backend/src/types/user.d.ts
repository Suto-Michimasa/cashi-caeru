import { Timestamp } from "firebase-admin/firestore";

export type User = {
  lineId: string; // lineのid
  totalBalance: number; // 合計収支
  createdAt: Timestamp; // 作成日
};
