import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import Ionicons from "@expo/vector-icons/Ionicons";
import useAppwrite from '../../lib/useAppwrite';
import { StatsData } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider';

const Period = {
  WEEK: "week",
};

const SummaryChart = () => {
  const [chartPeriod, setChartPeriod] = useState(Period.WEEK);
  const [barData, setBarData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [chartKey, setChartKey] = useState(0);
  const [transactionType, setTransactionType] = useState("Income");

  const { user, globalCurrency } = useGlobalContext();

  const { data: posts, refetch } = useAppwrite({ fn: () => StatsData(user?.$id) });

  const getWeekRange = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return { startDate: startOfWeek, endDate: endOfWeek };
  };


  const getExpenseCount = () => {
      const { startDate, endDate } = getWeekRange(currentDate);
    
      if (posts && posts.documents) {
        // Ensure startDate and endDate are Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);
  
    
        // Filter transactions based on transactionType and date range
        const filteredPosts = posts.documents.filter((transaction) => {
          const date = new Date(transaction.dateofpurchase.split('T')[0]);
          return transaction.type === "Expense" && date >= start && date <= end;
        });
    
        // Set counts based on filtered results
        const expenses = filteredPosts.filter(transaction => transaction.type === 'Expense').length;

       return expenses
    }
    return 0
  }

  const getIncomeCount = () => {
    const { startDate, endDate } = getWeekRange(currentDate);
  
    if (posts && posts.documents) {
      // Ensure startDate and endDate are Date objects
      const start = new Date(startDate);
      const end = new Date(endDate);

  
      // Filter transactions based on transactionType and date range
      const filteredPosts = posts.documents.filter((transaction) => {
        const date = new Date(transaction.dateofpurchase.split('T')[0]);
        return transaction.type === "Income" && date >= start && date <= end;
      });
  
      // Set counts based on filtered results
      const incomes = filteredPosts.filter(transaction => transaction.type === 'Income').length;

     return incomes
  }
  return 0
}

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
    refetch()
 };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
    refetch()
};


const fetchWeeklyData = (type, startDate, endDate) => {
  if (!posts || !posts.documents) return [];
  
  const weekData = Array(7).fill(0); // Array to hold sums for each day of the week (Sun=0, Mon=1, ..., Sat=6)
//console.log(startDate, endDate)

// const filteredPosts = posts.documents.reduce((acc, post) => {
//   const postDate = new Date(post.dateofpurchase);
//   if (post.type === type && postDate >= startDate && postDate <= endDate) {
//     acc.push(post);
//   } 
//   //  else if (post.type === type && new Date(postDate) < startDate || new Date(postDate) >= endDate) {
//   //    acc.push(post)
//   //    console.log("hyy", startDate)
//   //  }
//   return acc;
// }, []);

const filteredPosts = posts.documents.reduce((acc, post) => {
  const postDate = new Date(post.dateofpurchase);
  
  // Normalize the dates by setting the time to midnight (without mutating
  // the caller's Date objects).
  const normalizedPostDate = new Date(postDate);
  normalizedPostDate.setHours(0, 0, 0, 0);
  const normalizedStartDate = new Date(startDate);
  normalizedStartDate.setHours(0, 0, 0, 0);
  const normalizedEndDate = new Date(endDate);
  normalizedEndDate.setHours(0, 0, 0, 0);

  if (post.type === type && normalizedPostDate >= normalizedStartDate && normalizedPostDate <= normalizedEndDate) {
    acc.push(post);
  }

  return acc;
}, []);

  
filteredPosts.forEach(post => {
    const date = new Date(post.dateofpurchase);
    const day = date.getDay(); // Get the day of the week (0-6)
    weekData[day] += Number(post.ItemAmount) || 0; // Sum the ItemAmount for that specific day
  });

  return weekData.map((total, dayOfWeek) => ({
    dayOfWeek,
    total
  }));
};

  

const processWeeklyData = (data) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return data.map((item) => {
      // Ensure total is a number
      const totalValue = parseFloat(item.total) || 0;
      
      // Ensure dayOfWeek is within 0-6 range
      const dayIndex = item.dayOfWeek >= 0 && item.dayOfWeek < 7 ? item.dayOfWeek : 0;

      return {
          value: totalValue,
          label: days[dayIndex],
      };
  });
};


 
  useEffect(() => {
    if (posts && posts.documents) {
      if (chartPeriod === Period.WEEK) {
        const { startDate, endDate } = getWeekRange(currentDate);
        const data = fetchWeeklyData(transactionType, startDate, endDate);
        setBarData(processWeeklyData(data));
        //console.log(processWeeklyData(data))
        setChartKey((prev) => prev + 1);
      }
    }
  }, [posts, chartPeriod, currentDate, transactionType]);


  const { startDate: weekStart, endDate: weekEnd } = getWeekRange(currentDate);
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(230, Math.min(300, width - 110));
  const total = barData.reduce((sum, item) => sum + item.value, 0);

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View>
          <Text style={{ fontSize: 12, color: "#64748B", fontFamily: "Poppins-Regular" }}>
            This week
          </Text>
          <Text style={{ fontWeight: "700", fontSize: 16, color: "#0F172A", fontFamily: "Poppins-SemiBold" }}>
            {weekStart.toLocaleDateString("en-US", { month: "short" })}{" "}
            {weekStart.getDate()} -{" "}
            {weekEnd.toLocaleDateString("en-US", { month: "short" })}{" "}
            {weekEnd.getDate()}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ color: "#64748B", fontFamily: "Poppins-Regular", fontSize: 12 }}>
            Total {transactionType === "Expense" ? "Spending" : "Income"}
          </Text>
          <Text style={{ fontWeight: "700", fontSize: 28, color: "#0F172A", fontFamily: "Poppins-Bold" }}>
            {globalCurrency.symbol}{total.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={{ alignItems: "center", marginTop: 8 }}>
        <BarChart
          key={chartKey}
          data={barData}
          barWidth={16}
          height={100}
          width={chartWidth}
          minHeight={3}
          barBorderRadius={4}
          frontColor="#1F41BB"
          showGradient
          spacing={14}
          noOfSections={4}
          yAxisThickness={0}
          xAxisThickness={0}
          xAxisLabelsVerticalShift={2}
          xAxisLabelTextStyle={{ color: "#94A3B8", fontSize: 10 }}
          yAxisTextStyle={{ color: "#94A3B8", fontSize: 10 }}
          isAnimated
          animationDuration={300}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 14,
        }}
      >
        <TouchableOpacity
          onPress={handlePreviousWeek}
          style={{ alignItems: "center", width: 56 }}
          accessibilityRole="button"
          accessibilityLabel="Previous week"
        >
          <Ionicons name="chevron-back-circle" size={32} color="#94A3B8" />
          <Text style={{ fontSize: 10, color: "#64748B" }}>Prev</Text>
        </TouchableOpacity>

        <SegmentedControl
          values={[`Income (${getIncomeCount()})`, `Expense (${getExpenseCount()})`]}
          style={{ width: 190 }}
          selectedIndex={transactionType === "Income" ? 0 : 1}
          onChange={(event) => {
            const index = event.nativeEvent.selectedSegmentIndex;
            setTransactionType(index === 0 ? "Income" : "Expense");
          }}
        />

        <TouchableOpacity
          onPress={handleNextWeek}
          style={{ alignItems: "center", width: 56 }}
          accessibilityRole="button"
          accessibilityLabel="Next week"
        >
          <Ionicons name="chevron-forward-circle" size={32} color="#94A3B8" />
          <Text style={{ fontSize: 10, color: "#64748B" }}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SummaryChart;
