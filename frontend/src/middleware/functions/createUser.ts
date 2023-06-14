import { httpsCallable } from "firebase/functions";
import { CreateUserRequestBody } from "../types";
import { functions } from "@/plugins/firebase";

const createUserCallable = httpsCallable(functions, 'createUser');

export const createUser = (req: CreateUserRequestBody) =>
  createUserCallable(req)
