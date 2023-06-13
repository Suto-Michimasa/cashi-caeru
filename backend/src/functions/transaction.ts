
import {functions} from "../plugins/firebase";
import * as admin from "firebase-admin";

export const addLoan = functions.https.onRequest(async (req, res) => {
  const {lenderId, borrowerId, description, amount, deadline} = req.body;

  const newLoan = {
    is_marked: false,
    lenderId,
    borrowerId,
    description,
    amount,
    deadline,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: null,
  };

  const loanRef = await admin.firestore().collection("Loans").add(newLoan);

  res.send({loan_id: loanRef.id});
});
