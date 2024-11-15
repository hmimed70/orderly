import React from "react";
import { useTranslation } from "react-i18next"; // For translation support (optional)

const OrderTimeline = ({ order }) => {
  const { t } = useTranslation(); // Initialize translation hook (optional if using i18n)

  // Colors for each attempt status (customizable)
  const statusColors = {
    pending: "bg-yellow-400",         // Bright yellow for pending
    inProgress: "bg-blue-400",        // Sky blue for in-progress
    confirmed: "bg-green-400",        // Fresh green for confirmed
    cancelled: "bg-red-400",          // Vibrant red for cancelled
    didntAnswer1: "bg-amber-400",     // Soft amber for didn't answer 1
    didntAnswer2: "bg-amber-500",     // Medium amber for didn't answer 2
    didntAnswer3: "bg-amber-600",     // Rich amber for didn't answer 3
    didntAnswer4: "bg-amber-700",     // Dark amber for didn't answer 4
    phoneOff: "bg-gray-400",          // Neutral gray for phone off
    duplicate: "bg-orange-400",       // Warm orange for duplicate
    wrongNumber: "bg-pink-400",       // Bold pink for wrong number
    wrongOrder: "bg-red-600",         // Deep red for wrong order
  };

  return (
    <div className="relative max-w-2xl mx-auto p-4">
      {/* Wrapper for vertical line and scrollable content */}
      <div className="relative">
        {/* Vertical line */}
        <div className="border-l-4 border-gray-300 absolute left-[10px] h-full"></div>

        {/* Scrollable container for attempts */}
        <div
          className={`${
            order?.attempts?.length > 10 ? "overflow-y-scroll max-h-[550px]" : ""
          } scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-100`}
        >
          {order?.attempts?.map((attempt, index) => {
            // Ensure the status color is set correctly, defaulting to gray if not found
            const attemptStatus = statusColors[attempt.attempt] || "bg-gray-400"; // Default to gray if status is not found

            return (
              <div key={index} className="flex items-start mb-10 relative">
                {/* The colored circle indicating the status */}
                <div
                  className={`w-4 h-4 rounded-full border-2 border-white ${attemptStatus} absolute left-[4px] top-0`}
                ></div>

                {/* Timeline content */}
                <div className="ml-8 w-full">
                  <div className="flex justify-between items-center px-4">
                    <span className={`text-sm px-2 font-semibold text-white ${attemptStatus} rounded-lg`}>
                      {t(attempt.attempt)} {/* Translated attempt status */}
                    </span>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-200">
                      {new Date(attempt.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
