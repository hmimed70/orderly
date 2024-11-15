const moment = require("moment");

const getDateRange = (dateFilter) => {
  let startDate, endDate;

  // Check if the dateFilter includes a custom date range (e.g., "Sat Aug 03 2024, Sun Aug 25 2024")
  if (dateFilter.includes(",")) {
    const [start, end] = dateFilter.split(",");
    
    // Parse the start and end dates and trim any extra whitespace
    startDate = moment(new Date(start.trim()));
    endDate = moment(new Date(end.trim()));
    // Check if both dates are valid
    if (!startDate.isValid() || !endDate.isValid()) {
      return {}; // Return an empty object if dates are invalid
    }
    
    // Return the start and end dates with the time set to start and end of day
    return {
      startDate: startDate.startOf("day").toDate(),
      endDate: endDate.endOf("day").toDate(),
    };
  } 
};

module.exports = { getDateRange };
