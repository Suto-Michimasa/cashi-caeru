import { httpsCallable } from "firebase/functions";
import { CreateLoanRequestBody } from "../types";
import { functions } from "@/plugins/firebase";

const createLoanCallable = httpsCallable(functions, 'createLoan');

export const createLoan = (req: CreateLoanRequestBody) =>
  createLoanCallable(req)
