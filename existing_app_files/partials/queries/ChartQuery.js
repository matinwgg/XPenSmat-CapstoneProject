import React from "react";

export const processWeeklyData = (
  data,
  transactionsType = "Income"
) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const isIncome = transactionsType === "Income";

  const barData = days.map((label) => ({
    label,
    value: 0,
    frontColor: "#d1d5db", // default gray color for zero values
    gradientColor: "#d1d5db", // default gray color for zero values
  }));

  data.forEach((item) => {
    // Assuming item.dayOfWeek is in the range 0-6 (matching SQLite %w output)
    const dayIndex = item.dayOfWeek;
    if (dayIndex >= 0 && dayIndex < 7) {
      barData[dayIndex].value = item.total;
      if (item.total < 100) {
        barData[dayIndex].frontColor = "#d1d5db"; // gray for zero values
        barData[dayIndex].gradientColor = "#d1d5db"; // gray for zero values
      } else {
        barData[dayIndex].frontColor = isIncome ? "#d3ff00" : "#ffab00"; // default income/expense colors
        barData[dayIndex].gradientColor = isIncome ? "#12ff00" : "#ff0000"; // default income/expense gradients
      }
    } else {
      console.error(`Invalid day of week index: ${item.dayOfWeek}`);
    }
  });

  return barData;
};

// Example of using this function within a React component
const WeeklyDataComponent = ({ data, transactionsType }) => {
  const processedData = processWeeklyData(data, transactionsType);

  return (
    <div>
      {processedData.map((day, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <div>{day.label}</div>
          <div style={{ backgroundColor: day.frontColor, height: "20px", width: `${day.value}px` }}>
            {/* Simulating a bar chart */}
            <span style={{ color: day.gradientColor }}>{day.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeeklyDataComponent;
