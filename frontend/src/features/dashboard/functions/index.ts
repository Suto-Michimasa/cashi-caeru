import { httpsCallable } from "firebase/functions";
import { functions } from "@/plugins/firebase";

const getDashboardDataCallable = httpsCallable(functions, 'getDashboardData');

export const getDashboardData = (userId: string) => 
  getDashboardDataCallable({ userId })
