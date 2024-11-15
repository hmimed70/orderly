import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClear } from 'react-icons/md';
import MultiDatePicker from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/colors/teal.css'; // Import the styles you want to use

const DateFilter = ({ dateRange, notshow, handleDateRangeChange }) => {
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
    <div className="w-[180px] flex flex-col items-start justify-start p-3 ">
      {!notshow && <span className="">{t("date")}</span>}
      
      <div className="mb-3 flex justify-center items-center gap-x-1">
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
          className="border dark:bg-gray-600 border-orange-500 rounded-md shadow-sm" // Add border with orange color
          style={{
            backgroundColor: '#fff',       // Background color for the picker
            color: '#ea580c',               // Ensure text color is orange
            padding: '10px',                // Padding inside the picker area
          }}
        />
      <button
        onClick={handleClear}
        className="text-sm text-white bg-orange-500"
      >
        <MdClear size={25}/>
      </button>
      </div>

      {/* Clear Button to reset the date range */}
    </div>
  );
};

export default DateFilter;
