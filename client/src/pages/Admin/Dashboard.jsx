import { useTranslation } from 'react-i18next';
import OrderStatusChart from '../../components/orders/OrderStatusChart';
import OrdersChart from '../../components/orders/OrdersChart';
import { format } from 'date-fns';
import { useAdminOrder, useGetOrderCountsAdmin } from '../../hooks/useOrder';
import CardStat from '../../components/orders/CardStat';

const Dashboard = () => {
  const { t } = useTranslation(); // Initialize the `t` function
  const { isLoading: loadAdmin, dataCount } = useGetOrderCountsAdmin();

  const { isLoading, data } = useAdminOrder(1, 10000, "", "month");

  if (isLoading || loadAdmin) {
    return <div>{t('loading') || "Loading..."}</div>;
  }

  const { pending, inProgress, confirmed, cancelled } = dataCount.counts ;
  const {  orders } = data;

  const ordersByDate = orders?.reduce((acc, order) => {
    const date = format(new Date(order.createdAt), 'yyyy-MM-dd'); // Format date as YYYY-MM-DD
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  return (
    <>
      <div className="dashboard grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
     
        <CardStat statut={inProgress} statutText={t('inProgressOrders')} statutColor="#3b82f6" />

        <CardStat statut={pending} statutText={t('pendingOrders')} statutColor="#e1e121" />
        <CardStat statut={confirmed} statutText={t('confirmedOrders')} statutColor="#22c55e " />
        <CardStat statut={cancelled} statutText={t('cancelledOrders')} statutColor="#ef4444" />
        <CardStat statut={(inProgress || 0) + (confirmed || 0) + (cancelled || 0) + (pending || 0)} statutText={t('totalOrders')} statutColor="#6b7280" />
        </div>
      <div className='flex flex-col space-x-4 lg:flex-row justify-between items-center'>
        <OrdersChart ordersByDate={ordersByDate} />
        <div className="chart-container w-full dark:bg-gray-900 col-span-full lg:w-2/5 bg-white p-6 rounded-md shadow-md mt-6">
          <h3 className="text-lg font-bold mb-4">{t('orderStatusChartTitle')}</h3>
          <OrderStatusChart
            inProgressOrders={inProgress}
            confirmedOrders={confirmed}
            cancelledOrders={cancelled}
            pendingOrders={pending}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
