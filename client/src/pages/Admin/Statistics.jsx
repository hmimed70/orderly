import  { useState } from 'react';
import { useGetUserStatistics } from '../../hooks/useOrder';
import DateFilter from '../../components/shared/DateFilter';
import UsersOrderChart from '../../components/users/UserOrderChart';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const { isLoading, error, data } = useGetUserStatistics(dateRange);

   const { t } = useTranslation();
   const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    // Perform any additional filtering actions with the date range
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
    shippedOrders: order.shippedOrders,
  }));

  return (
<>
  <div className="chart-page-container">
    <div className="chart-container">
      <div className='mx-auto w-1/2 flex items-center justify-center'>
    <DateFilter notshow dateRange={dateRange} handleDateRangeChange={handleDateRangeChange} />       
      </div>
    <UsersOrderChart chartData={chartData} />
    </div>
  </div>
</>

  );
};

export default Dashboard;
