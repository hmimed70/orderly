import  { useState } from 'react';
import { useGetUserStatistics } from '../../hooks/useOrder';
import DateFilter from '../../components/shared/DateFilter';
import UsersOrderChart from '../../components/users/UserOrderChart';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const [dateFilter, setDateFilter] = useState("day"); // Default filter: This week
  const { isLoading, error, data } = useGetUserStatistics(dateFilter);
   const { t } = useTranslation();
  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
  };

  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  if (error) {
    return <div>{t('error')}</div>;
  }

  // Transform data for chart
  const chartData = data.orders.map((order) => ({
    fullname: order.fullname,
    confirmedOrders: order.confirmedOrders,
    cancelledOrders: order.cancelledOrders,
  }));

  return (
<>
  <div className="chart-page-container">
    <div className="chart-container">
      <DateFilter day={dateFilter} handleDayChange={handleDateFilterChange} />
      <UsersOrderChart chartData={chartData} />
    </div>
  </div>
</>

  );
};

export default Dashboard;
