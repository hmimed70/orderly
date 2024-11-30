import React from "react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css"; // Import styles
import { useTranslation } from "react-i18next"; // Optional for translations

const OrderTimeline = ({ order }) => {
  const { t } = useTranslation();

  // Colors for each attempt status
  const statusColors = {
    pending: "#facc15", // Yellow
    inProgress: "#3b82f6", // Blue
    confirmed: "#22c55e", // Green
    cancelled: "#ef4444", // Red
    didntAnswer1: "#fbbf24", // Amber
    didntAnswer2: "#f59e0b", // Darker amber
    didntAnswer3: "#d97706", // Even darker amber
    didntAnswer4: "#b45309", // Deep amber
    phoneOff: "#9ca3af", // Gray
    duplicate: "#f97316", // Orange
    wrongNumber: "#ec4899", // Pink
    wrongOrder: "#b91c1c", // Deep red
  };

  const hasMoreThanFourAttempts = order?.attempts?.length > 4;

  return (
    <div className="max-w-4xl mx-auto p-3 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
      <VerticalTimeline layout="1-column-left" className="custom-timeline">
        {/* Set max height and overflow with custom scrollbar styles */}
        <div
          className={`max-h-[1000px] overflow-y-auto custom-scrollbar`}
        >
          {order?.attempts?.map((attempt, index) => {
            const color = statusColors[attempt.attempt] || "#9ca3af"; // Default gray

            return (
              <VerticalTimelineElement
                key={index}
                contentStyle={{
                  background: color,
                  color: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  padding: "8px", // Reduce padding inside the element
                }}
                contentArrowStyle={{
                  borderRight: `7px solid ${color}`,
                }}
                date={new Date(attempt.timestamp).toLocaleString()}
                dateClassName="text-white text-xs font-semibold"
                iconStyle={{
                  background: color,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "5px", // Reduce the space between the icon and the content
                }}
                icon={
                  <span className="text-md font-bold">
                    {index + 1}
                  </span>
                }
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {t(attempt.attempt)}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {t(attempt.user)}
                  </p>
                </div>
              </VerticalTimelineElement>
            );
          })}
        </div>
      </VerticalTimeline>
    </div>
  );
};

export default OrderTimeline;
