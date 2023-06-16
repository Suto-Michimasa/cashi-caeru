import { httpsCallable } from "firebase/functions";
import { CreateLoanRequestBody, UpdateLoanRequestBody } from "../types";
import { functions } from "@/plugins/firebase";

const createLoanCallable = httpsCallable(functions, 'createLoan');
const completePaymentCallable = httpsCallable(functions, 'completePayment');
const updateLoanCallable = httpsCallable(functions, 'updateLoan');

export const createLoan = (req: CreateLoanRequestBody) =>
  createLoanCallable(req);

export const completePayment = (paymentId: string) =>
  completePaymentCallable({ paymentId })

export const updateLoan = (req: UpdateLoanRequestBody) =>
  updateLoanCallable(req)
