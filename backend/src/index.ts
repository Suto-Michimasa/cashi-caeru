import { functions } from "./plugins/firebase";
import { loanCollection, userCollection } from "./const/collection";
import { createLoanDocData } from "./functions/loan";
import { createUserDocumentFunction } from "./functions/user";

import { AddLoanRequestBody } from "./types/loan";
import { CreateUserPayload } from "./types/user";


// ユーザの作成(line_idが存在する場合には作成しない)
export const createUser = functions.https.onCall(async (data: CreateUserPayload) => {
  const userDocData = await createUserDocumentFunction(data);
  if (!userDocData) {
    return { message: "already exists" };
  }
  await userCollection.add(userDocData);
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
