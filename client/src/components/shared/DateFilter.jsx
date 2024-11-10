import React from 'react';
import { useTranslation } from 'react-i18next';

const DateFilter = ({ day, handleDayChange }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center space-x-2">
      <span className='px-1'>{t("date")}</span>
      <select
        value={day}
        onChange={handleDayChange}
        className="p-2 bg-gray-50 border px-8 md:px-4 border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
      >
        <option value="">{t("allTimes")}</option>
        <option value="day">{t("thisDay")}</option>
        <option value="week">{t("thisWeek")}</option>
        <option value="month">{t("thisMonth")}</option>
        <option value="year">{t("thisYear")}</option>
      </select>
    </div>
  );
};

export default DateFilter;
