import { Timestamp } from "./firebase";

interface UserData {
  name: string;
  pictureUrl: string;
  amount: number; // 金額
  deadline: Timestamp // 締切
}

interface DashboardData {
  totalBalance: number;
  payments: UserData[];
}
