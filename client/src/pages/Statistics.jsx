import { useGetOrderCountsUser } from '../hooks/useOrder';
import EarningsChart from '../components/users/EarningsChart';
import { useTranslation } from 'react-i18next';
import CardStat from '../components/orders/CardStat';
import { useNavigate } from 'react-router-dom';

const StatisticsUser = () => {
  const { t } = useTranslation(); // Hook for translations
  const { isLoading: loadAdmin, dataCount } = useGetOrderCountsUser();
  const navigate = useNavigate();
  if (loadAdmin) {
    return <div>{t('loading')}</div>; // Translated loading text
  }

  const { dailyEarnings, statusLivraisonCounts } = dataCount; // Assuming dailyEarnings is an array of earnings by day
  const { inProgress, confirmed, cancelled } = dataCount.counts;
  const { earningsThisMonth } = dataCount;

  // Extracting and combining statusLivraison counts from dataCount
  const handleNavigate = (filterKey) => {
    navigate(`/orders?filter_status=${filterKey}`);
  };
  return (
    <>
       <div className="dashboard grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Displaying status counts for orders */}
        <CardStat
          onClick={() => handleNavigate('inProgress')}
          statut={inProgress}
          statutText={t('inProgressOrders')}
          statutColor="#3b82f6"
        />
        <CardStat
          onClick={() => handleNavigate('confirmed')}
          statut={confirmed}
          statutText={t('confirmedOrders')}
          statutColor="#22c55e"
        />
        <CardStat
          onClick={() => handleNavigate('cancelled')}
          statut={cancelled}
          statutText={t('cancelledOrders')}
          statutColor="#ef4444"
        />

        {/* Total orders card */}
        <CardStat
          onClick={() => handleNavigate('')}
          statut={(inProgress || 0) + (confirmed || 0) + (cancelled || 0) }
          statutText={t('totalOrders')}
          statutColor="#6b7280"
        />

        {/* Displaying statusLivraison counts */}
        <CardStat
          onClick={() => navigate(`/trash?filter_status=Retour`)}
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
          onClick={() => navigate(`/trash?filter_status=Supprimee`)}
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
        <CardStat
          statut={earningsThisMonth +' '+ t('currency')} statutText={t('earningsThisMonth')}
          statutColor="#7b21f0" 
         />
          </div>
      {/* Earnings Chart */}
      <EarningsChart dailyEarnings={dailyEarnings} />
    </>
  );
};

export default StatisticsUser;
