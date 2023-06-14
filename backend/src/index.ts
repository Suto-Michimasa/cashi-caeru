import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { functions } from "./plugins/firebase";
import { loanCollection, userCollection } from "./const/collection";
import { createLoanDocData } from "./functions/loan";
import { AddLoanRequestBody } from "./types/loan";

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

// ユーザの作成(line_idが存在する場合には作成しない)
// 認証フローどうする問題
export const createUser = functions.https.onCall(async (data, context) => {
  const { lineId, name } = data;
  const userSnap = await userCollection.where("lineId", "==", lineId).get();
  if (userSnap.size > 0) {
    return { message: "already exists" };
  }
  await userCollection.add({ lineId, name });
  return { message: "success" };
});

// 貸し借り作成
export const createLoan = functions.https.onCall(
  async (data: AddLoanRequestBody) => {
    const { borrowerId, lenderId, description, amount, deadline } = data;
    const loanDocData = createLoanDocData(borrowerId, lenderId, description, amount, deadline);
    await loanCollection.add(loanDocData);
    return { message: "success" };
  }
);
