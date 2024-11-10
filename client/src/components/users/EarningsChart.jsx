import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

function EarningsChart({ dailyEarnings }) {
  const { t } = useTranslation();
  const data = dailyEarnings.map(entry => ({
    date: moment(entry.date, 'D').format('ddd, D'), // Format to show day of the week, day of month
    totalConfirmedOrders: entry.totalConfirmedOrders
  }));

  return (
    <div className="chart-container w-full dark:bg-gray-900 bg-white p-6 rounded-md shadow-md mt-6">
      <h3 className="text-lg font-bold mb-4">{t('dailyorder')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalConfirmedOrders" fill="#a855f7" name="Total Confirmed Orders" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EarningsChart;
