import {Timestamp} from "firebase-admin/firestore";

export type User = {
  id: string; // firebaseのuid
  line_id: string; // lineのid
  total_balance: number; // 合計収支
  createdAt: Timestamp; // 作成日
};
