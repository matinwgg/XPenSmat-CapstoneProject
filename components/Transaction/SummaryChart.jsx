import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { SymbolView } from "expo-symbols";

const Period = {
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
};

export default function SummaryChart() {
  const [chartPeriod, setChartPeriod] = useState(Period.WEEK);
  const [barData, setBarData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentEndDate, setCurrentEndDate] = useState(new Date());
  const [chartKey, setChartKey] = useState(0);
  const [transactionType, setTransactionType] = useState("Income");

  useEffect(() => {
    if (chartPeriod === Period.WEEK) {
      const { startDate, endDate } = getWeekRange(currentDate);
      setCurrentEndDate(new Date(startDate));
      const data = fetchWeeklyData(transactionType);
      setBarData(processWeeklyData(data));
      setChartKey((prev) => prev + 1);
    }
  }, [chartPeriod, currentDate, transactionType]);

  const getWeekRange = (date) => {
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    const endOfWeek = new Date(date.setDate(startOfWeek.getDate() + 6));
    return { startDate: startOfWeek, endDate: endOfWeek };
  };

  const handlePreviousWeek = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
  };

  const handleNextWeek = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
  };

  const fetchWeeklyData = (type) => {
    // Hard-coded example data for bar chart
    return [
      { dayOfWeek: 0, total: type === "Income" ? 120 : 50 },
      { dayOfWeek: 1, total: type === "Income" ? 150 : 70 },
      { dayOfWeek: 2, total: type === "Income" ? 180 : 90 },
      { dayOfWeek: 3, total: type === "Income" ? 220 : 60 },
      { dayOfWeek: 4, total: type === "Income" ? 300 : 100 },
      { dayOfWeek: 5, total: type === "Income" ? 200 : 80 },
      { dayOfWeek: 6, total: type === "Income" ? 250 : 110 },
    ];
  };

  const processWeeklyData = (data) => {
    // Process data for BarChart
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return data.map((item) => ({
      value: item.total,
      label: days[item.dayOfWeek],
    }));
  };

  return (
    <View>
      <Text style={{ fontWeight: "700", fontSize: 18, }}>
        {currentEndDate.toLocaleDateString("en-US", { month: "short" })}{" "}
        {currentEndDate.getDate()} -{" "}
        {currentDate.toLocaleDateString("en-US", { month: "short" })}{" "}
        {currentDate.getDate()}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: -5 }} >
        <Text style={{ color: "gray"}}>
          Total {transactionType === "Expense" ? "Spending" : "Income"}
        </Text>

        <Text style={{ fontWeight: "700", fontSize: 32, marginBottom: 16 }}>
          ${barData.reduce((total, item) => total + item.value, 0).toFixed(2)}
        </Text>
      </View>
     

      <BarChart
        key={chartKey}
        data={barData}
        barWidth={18}
        height={70}
        width={290}
        minHeight={3}
        barBorderRadius={3}
        showGradient
        spacing={20}
        noOfSections={4}
        yAxisThickness={0}
        xAxisThickness={0}
        xAxisLabelsVerticalShift={2}
        xAxisLabelTextStyle={{ color: "gray" }}
        yAxisTextStyle={{ color: "gray" }}
        isAnimated
        animationDuration={300}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginTop: 16,
        }}
      >
        <TouchableOpacity
          onPress={handlePreviousWeek}
          style={{ alignItems: "center" }}
        >
          <SymbolView
            name="chevron.left.circle.fill"
            size={40}
            type="hierarchical"
            tintColor={"gray"}
          />
          <Text style={{ fontSize: 11, color: "gray" }}>Prev week</Text>
        </TouchableOpacity>

        <SegmentedControl
          values={["Income", "Expense"]}
          style={{ width: 200 }}
          selectedIndex={transactionType === "Income" ? 0 : 1}
          onChange={(event) => {
            const index = event.nativeEvent.selectedSegmentIndex;
            setTransactionType(index === 0 ? "Income" : "Expense");
          }}
        />

        <TouchableOpacity
          onPress={handleNextWeek}
          style={{ alignItems: "center" }}
        >
          <SymbolView
            name="chevron.right.circle.fill"
            size={40}
            type="hierarchical"
            tintColor={"gray"}
          />
          <Text style={{ fontSize: 11, color: "gray" }}>Next week</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
