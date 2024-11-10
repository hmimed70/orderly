// utils/dateHelpers.js

const moment = require("moment");

const getDateRange = (dateFilter) => {
  let startDate, endDate;
   
  switch (dateFilter) {
    case "day":
      startDate = moment().startOf("day").toDate();
      endDate = moment().endOf("day").toDate();
      break;
    case "week":
      startDate = moment().startOf("week").toDate(); // Start of the week
      endDate = moment().endOf("week").toDate(); // End of the week
      break;
    case "month":
      startDate = moment().startOf("month").toDate();
      endDate = moment().endOf("month").toDate();
      break;
    case "year":
      startDate = moment().startOf("year").toDate();
      endDate = moment().endOf("year").toDate();
      break;
    default:
      break;
  }
  return { startDate, endDate };
};

module.exports = { getDateRange };
