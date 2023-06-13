import * as functionsModule from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functionsModule.config().firebase);

export const db = admin.firestore();
export const auth = admin.auth();
export const functions = functionsModule.region("asia-northeast1");
export const config = functionsModule.config();

export default admin;
