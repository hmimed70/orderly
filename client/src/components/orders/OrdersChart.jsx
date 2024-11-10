import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { useTranslation } from 'react-i18next';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const OrdersChart = ({ ordersByDate }) => {
  const { t } = useTranslation();
  
  const dates = Object.keys(ordersByDate);
  const counts = Object.values(ordersByDate);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: t("ordersByDate"),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        data: counts,
      },
    ],
  };

  return (
    <div className="chart-container dark:bg-gray-900 col-span-full w-full lg:w-4/5 bg-white p-6 rounded-md shadow-md mt-6 h-[490px]">
      <h3 className="text-lg font-bold mb-4">{t("createdOrdersThisMonth")}</h3>
      <Bar data={chartData} />
    </div>
  );
};

export default OrdersChart;
