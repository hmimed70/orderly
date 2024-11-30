import { useTranslation } from 'react-i18next';
import OrderStatusChart from '../../components/orders/OrderStatusChart';
import OrdersChart from '../../components/orders/OrdersChart';
import { format } from 'date-fns';
import { useAdminOrder, useGetOrderCountsAdmin } from '../../hooks/useOrder';
import CardStat from '../../components/orders/CardStat';
import { useMemo } from 'react';
import { getCurrentMonthRange } from '../../utils';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { t } = useTranslation(); // Initialize the `t` function
  const { isLoading: loadAdmin, dataCount } = useGetOrderCountsAdmin();
  const currentMonth = useMemo(() => getCurrentMonthRange(), []);

  const  navigate = useNavigate();
  const { isLoading, data } = useAdminOrder(1, 10000, "", currentMonth);

  if (isLoading || loadAdmin) {
    return <div>{t('loading') || "Loading..."}</div>;
  }
  const { pending, inProgress, confirmed, cancelled } = dataCount.counts;
  const { orders } = data;

  const ordersByDate = orders?.reduce((acc, order) => {
    const date = format(new Date(order.createdAt), 'yyyy-MM-dd'); // Format date as YYYY-MM-DD
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Extracting and combining statusLivraison counts from dataCount
  const { statusLivraisonCounts } = dataCount;
  const handleNavigate = (filterKey) => {
    navigate(`/orders?filter_status=${filterKey}`);
  };
  return (
    <>
      <div className="dashboard grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Displaying status counts for orders */}
        <CardStat  onClick={() => handleNavigate('inProgress')} statut={inProgress} statutText={t('inProgressOrders')} statutColor="#3b82f6" />
        <CardStat  onClick={() => handleNavigate('pending')} statut={pending} statutText={t('pendingOrders')} statutColor="#e1e121" />
        <CardStat onClick={() => handleNavigate('confirmed')}  statut={confirmed} statutText={t('confirmedOrders')} statutColor="#22c55e " />
        <CardStat onClick={() => handleNavigate('cancelled')} statut={cancelled} statutText={t('cancelledOrders')} statutColor="#ef4444" />
        
        {/* Total orders card */}
        <CardStat 
        onClick={() => handleNavigate('')}
          statut={(inProgress || 0) + (confirmed || 0) + (cancelled || 0) + (pending || 0)} 
          statutText={t('totalOrders')} 
          statutColor="#6b7280" 
        />
        
        {/* Displaying statusLivraison counts */}
        <CardStat 
          onClick={() =>navigate(`/trash?filter_status=Retour`)}
          statut={statusLivraisonCounts?.Retour || 0} 
          statutText={t('Retour')} 
          statutColor="#ef7f44" 
        />
        <CardStat 
                onClick={() => handleNavigate('Livrée')}
          statut={statusLivraisonCounts?.Livrée || 0} 
          statutText={t('Livrée')} 
          statutColor="#3b82f6" 
        />
        <CardStat 
                onClick={() => handleNavigate('En_Preparation')}
          statut={statusLivraisonCounts?.En_Preparation || 0} 
          statutText={t('En_Preparation')} 
          statutColor="#f3a826" 
        />
           <CardStat 
          onClick={() => handleNavigate('En_Traitement')}
          statut={statusLivraisonCounts?.En_Traitement || 0} 
          statutText={t('En_Traitment')} 
          statutColor="#71f741" 
        />
        <CardStat 
          onClick={() =>navigate(`/trash?filter_status=Supprimee`)}
          statut={statusLivraisonCounts?.Supprimee || 0} 
          statutText={t('Supprimee')} 
          statutColor="#d51f36" 
        />
        <CardStat 
          onClick={() => handleNavigate('En_Livraison')}
          statut={statusLivraisonCounts?.En_Livraison || 0} 
          statutText={t('En_Livraison')} 
          statutColor="#6b7280" 
        />
      </div>

      {/* Order charts */}
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
