import { httpsCallable } from "firebase/functions";
import { CreateLoanRequestBody } from "../types";
import { functions } from "@/plugins/firebase";

const createLoanCallable = httpsCallable(functions, 'createLoan');
const completePaymentCallable = httpsCallable(functions, 'completePayment');

export const createLoan = (req: CreateLoanRequestBody) =>
  createLoanCallable(req)

export const completePayment = (paymentId: string) =>
  completePaymentCallable({ paymentId })