import React from 'react';
import { Bar } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useTranslation } from 'react-i18next'; // Import the translation hook

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UsersOrderChart = ({ chartData }) => {
  const { t } = useTranslation(); // Initialize the translation hook

  // Check if dark mode is enabled
  const isDarkMode = document.documentElement.classList.contains('dark');

  const data = {
    labels: chartData.map(user => user.fullname), // Users' names as x-axis labels
    datasets: [
      {
        label: t('usersOrderChart.confirmedOrders'), // Translated label
        data: chartData.map(user => user.confirmedOrders),
        borderColor: isDarkMode ? '#2674d3' : 'blue', // Light green for light mode, dark green for dark mode
        backgroundColor: isDarkMode ? 'rgba(0, 89, 255, 0.981)':  'rgba(33, 137, 255, 0.6)'  // Light green background for dark mode
      },
      {
        label: t('usersOrderChart.cancelledOrders'), // Translated label
        data: chartData.map(user => user.shippedOrders),
        borderColor: isDarkMode ? '#4ddf30' : 'green', // Red for light mode, dark red for dark mode
        backgroundColor: isDarkMode ? 'rgba(6, 235, 86, 0.6)' : 'rgba(9, 252, 102, 0.6)' , // Light red background for dark mode
      }
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: t('usersOrderChart.title'), // Translated title
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default UsersOrderChart;
