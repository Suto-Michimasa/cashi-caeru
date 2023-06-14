import { Timestamp } from "firebase-admin/firestore";
import { userCollection } from "../const/collection";
import { CreateUserPayload, User } from "../types/user";

// ユーザー作成
export const createUserDocumentFunction = async (
  data: CreateUserPayload
): Promise<User | null> => {
  const noDoc = (await userCollection.where("lineId", "==", data.lineId).get()).empty;
  if (!noDoc) {
    return null;
  }
  return {
    lineId: data.lineId,
    name: data.name,
    pictureUrl: data.pictureUrl,
    totalBalance: 0,
    createdAt: Timestamp.fromDate(new Date()),
  };
};
