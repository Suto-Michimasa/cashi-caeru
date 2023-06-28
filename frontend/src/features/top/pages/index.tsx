
import { useContext, useEffect, useState } from 'react';
import { getDashboardData } from '../functions';
import { DashboardData } from '../types';
import { TopPageComponent } from '../components/Top';
import { useLiff } from '@/middleware/LineProvider';

import toast, { Toaster, resolveValue } from 'react-hot-toast';

export const TopPage = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const { liff } = useLiff();
  ; // ユーザーIDを適切に指定する
  useEffect(() => {
    // ダッシュボードデータの取得
    const fetchDashboardData = async () => {
      if (liff) {
        try {
          const profile = await liff?.getProfile();
          const userId = profile?.userId || '';
          const data = await getDashboardData(userId); // ダッシュボードデータを取得
          setDashboardData(data); // ダッシュボードデータをstateにセット
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      };
    };
    fetchDashboardData();
  }, [liff]);
  // dashboardDataがnullの場合は、loading...を表示
  // dashboardDataがnullでない場合は、Topコンポーネントを表示
  return (
    <>
      {!dashboardData &&
        <Toaster
          reverseOrder={false}
          position={'top-center'}
        />
      }
      {dashboardData && <TopPageComponent dashboardData={dashboardData} />}
    </>
  );
};  
