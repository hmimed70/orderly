import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';

const COLORS = ['#82ca9d', '#ff8042', '#8884d8', '#ffcc00']; // New color arrangement

const OrderStatusChart = ({ pendingOrders, inProgressOrders, confirmedOrders, cancelledOrders }) => {
  const { t } = useTranslation();

  const data = [
    { name: t("inProgress"), value: inProgressOrders || 0 },
    { name: t("confirmed"), value: confirmedOrders || 0 },
    { name: t("cancelled"), value: cancelledOrders || 0 },
    { name: t("pending"), value: pendingOrders || 0 },
  ];

  return (
    <PieChart className="w-full dark:bg-gray-900" width={400} height={400}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={150}
        label
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default OrderStatusChart;
