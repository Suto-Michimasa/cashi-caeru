import { httpsCallable } from "firebase/functions";
import { CreateLoanRequestBody, UpdateLoanRequestBody, SendReminderRequestBody } from "../types";
import { functions } from "@/plugins/firebase";

const createLoanCallable = httpsCallable(functions, 'createLoan');
const completePaymentCallable = httpsCallable(functions, 'completePayment');
const updateLoanCallable = httpsCallable(functions, 'updateLoan');
const sendReminderCallable = httpsCallable(functions, 'sendReminder');

export const createLoan = (req: CreateLoanRequestBody) =>
  createLoanCallable(req);

export const completePayment = (paymentId: string) =>
  completePaymentCallable({ paymentId })

export const updateLoan = (req: UpdateLoanRequestBody) =>
  updateLoanCallable(req)
export const sendReminder = (req: SendReminderRequestBody) =>
  sendReminderCallable(req);
