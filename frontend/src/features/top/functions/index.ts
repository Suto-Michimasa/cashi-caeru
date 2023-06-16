import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { functions } from "@/plugins/firebase";
import { DashboardData, GetDashboardRequestBody } from "../types";

const getDashboardDataCallable = httpsCallable<GetDashboardRequestBody, DashboardData>(functions, 'getDashboardData');

export const getDashboardData = (userId: string): Promise<DashboardData> => 
  getDashboardDataCallable({ userId })
    .then((result: HttpsCallableResult<DashboardData>) => {
      const data = result.data;
      console.log('data', data)
      if (data) {
        return data;
      } else {
        throw new Error('Dashboard data not found');
      }
    });
