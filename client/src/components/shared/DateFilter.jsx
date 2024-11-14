import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MultiDatePicker from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/colors/teal.css'; // Import the styles you want to use

const DateFilter = ({ dateRange, handleDateRangeChange }) => {
  const { t } = useTranslation();

  // Handle date change from the MultiDatePicker
  const onDateChange = (dates) => {
    if (dates && dates.length === 2) {
      handleDateRangeChange([dates[0], dates[1]]);
    }
  };

  const handleClear = () => {
    handleDateRangeChange([null, null]); // Clear the date range when button is pressed
  };

  return (
    <div className="relative flex items-center p-3">
      <span className="">{t("dateRange")}</span>

      <MultiDatePicker
        value={dateRange}                // The selected range of dates
        onChange={onDateChange}           // Handle date change
        range                          // Enable range selection
        format="YYYY-MM-DD"              // Date format
        placeholder={t("selectDateRange")} // Placeholder text for the date range
        clearButton                     // Show the clear button to reset the date
        disableYearPicker               // Disable year picker if you don't need it
        disableMonthPicker              // Disable month picker if you don't need it
        color="#ea580c"                  // Customize the color of the picker (orange color)
        className="border border-orange-500 rounded-md shadow-sm" // Add border with orange color
        style={{
          backgroundColor: '#fff',       // Background color for the picker
          color: '#ea580c',               // Ensure text color is orange
          padding: '10px',                // Padding inside the picker area
        }}
      />

      {/* Clear Button to reset the date range */}
      <button 
        onClick={handleClear}
        className="ml-2 p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
      >
        {t("clear")}
      </button>
    </div>
  );
};

export default DateFilter;
