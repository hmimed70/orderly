import { useGetOrderCountsUser } from '../hooks/useOrder';
import EarningsChart from '../components/users/EarningsChart';
import { useTranslation } from 'react-i18next';

const StatisticsUser = () => {
  const { t } = useTranslation(); // Hook for translations
  const { isLoading: loadAdmin, dataCount } = useGetOrderCountsUser();

  if (loadAdmin) {
    return <div>{t('loading')}</div>; // Translated loading text
  }

  const { dailyEarnings } = dataCount; // Assuming dailyEarnings is an array of earnings by day
  const { inProgress, confirmed, cancelled } = dataCount.counts;
  const { earningsThisMonth } = dataCount;

  return (
    <>
      <div className="dashboard grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* In Progress Orders */}
        <div className="card bg-blue-500 text-white p-4 rounded-md shadow-md">
          <h3 className="text-lg font-bold">{t('inProgressOrders')}</h3>
          <p className="text-2xl">{inProgress}</p>
        </div>

        {/* Confirmed Orders */}
        <div className="card bg-green-500 text-white p-4 rounded-md shadow-md">
          <h3 className="text-lg font-bold">{t('confirmedOrders')}</h3>
          <p className="text-2xl">{confirmed}</p>
        </div>

        {/* Cancelled Orders */}
        <div className="card bg-red-500 text-white p-4 rounded-md shadow-md">
          <h3 className="text-lg font-bold">{t('cancelledOrders')}</h3>
          <p className="text-2xl">{cancelled}</p>
        </div>

        {/* Total Orders */}
        <div className="card bg-gray-500 text-white p-4 rounded-md shadow-md">
          <h3 className="text-lg font-bold">{t('totalOrders')}</h3>
          <p className="text-2xl">{(inProgress || 0) + (confirmed || 0) + (cancelled || 0)}</p>
        </div>

        {/* Monthly Earnings */}
        <div className="card bg-purple-500 text-white p-4 rounded-md shadow-md">
          <h3 className="text-lg font-bold">{t('earningsThisMonth')}</h3>
          <p className="text-2xl font-semibold">{earningsThisMonth || 0}.00 DA</p>
        </div>
      </div>

      <EarningsChart dailyEarnings={dailyEarnings} />
    </>
  );
};

export default StatisticsUser;
