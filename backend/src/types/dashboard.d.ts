import { Timestamp } from "./firebase";

type UserData = {
  name: string;
  pictureUrl: string;
  amount: number; // 金額
  deadline: Timestamp // 締切
}


export interface DashboardData {
  totalBalance: number;
  payments: UserData[];
}

