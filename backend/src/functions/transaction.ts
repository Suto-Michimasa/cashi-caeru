import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const addLoan = functions.https.onRequest(async (req, res) => {
  const {lenderId, borrowerId, transactionName, amount, dueDate} = req.body;

  const newLoan = {
    lenderId,
    borrowerId,
    transactionName,
    amount,
    dueDate,
    status: "未返済",
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
  };

  const loanRef = await admin.firestore().collection("Loans").add(newLoan);

  res.send({loan_id: loanRef.id});
});
