import { Timestamp } from '@firebase/firestore';

export type GetDashboardRequestBody = {
  userId: string;
};

type UserData = {
  name: string;
  pictureUrl: string;
  amount: number; // 金額
  deadline: Timestamp; // 締切
  paymentId: string;
};

export interface DashboardData {
  totalBalance: number;
  payments: UserData[];
}
