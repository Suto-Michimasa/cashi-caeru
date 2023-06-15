type UserData = {
  name: string;
  pictureUrl: string;
  amount: number; // 金額
  deadline: string | Date // 締切
}


export interface DashboardData {
  totalBalance: number;
  payments: UserData[];
}

