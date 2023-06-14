import { Timestamp } from "firebase-admin/firestore";

export type User = {
  lineId: string; // lineのid
  name: string; // 名前
  pictureUrl: string; // プロフィール画像のURL
  totalBalance: number; // 合計収支
  createdAt: Timestamp; // 作成日
};

export type CreateUserPayload = {
  lineId: string; // lineのid
  name: string; // 名前
  pictureUrl: string; // プロフィール画像のURL
};
