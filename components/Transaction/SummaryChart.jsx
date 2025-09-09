import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { SymbolView } from "expo-symbols";
import useAppwrite from '../../lib/useAppwrite';
import { StatsData } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider';

const Period = {
  WEEK: "week",
};

export  default SummaryChart = () => {
  const [chartPeriod, setChartPeriod] = useState(Period.WEEK);
  const [barData, setBarData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentEndDate, setCurrentEndDate] = useState(new Date());
  const [chartKey, setChartKey] = useState(0);
  const [transactionType, setTransactionType] = useState("Income");

  const { user, globalCurrency } = useGlobalContext();

  const { data: posts, refetch } = useAppwrite({ fn: () => StatsData(user?.$id) });

  const getWeekRange = (date) => {
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    const endOfWeek = new Date(date.setDate(startOfWeek.getDate() + 6));
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
  
  // Normalize the dates by setting the time to midnight
  const normalizedPostDate = new Date(postDate.setHours(0, 0, 0, 0));
  const normalizedStartDate = new Date(startDate.setHours(0, 0, 0, 0));
  const normalizedEndDate = new Date(endDate.setHours(0, 0, 0, 0));

  if (post.type === type && normalizedPostDate >= normalizedStartDate && normalizedPostDate <= normalizedEndDate) {
    acc.push(post);
  }

  return acc;
}, []);

  
filteredPosts.forEach(post => {
    const date = new Date(post.dateofpurchase);
    const day = date.getDay(); // Get the day of the week (0-6)
    console.log(day)
    weekData[day] += post.ItemAmount; // Sum the ItemAmount for that specific day
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
        setCurrentEndDate(new Date(startDate));
        const data = fetchWeeklyData(transactionType, startDate, endDate);
        setBarData(processWeeklyData(data));
        //console.log(processWeeklyData(data))
        setChartKey((prev) => prev + 1);
      }
    }
  }, [posts, chartPeriod, currentDate, transactionType]);


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
          {globalCurrency.symbol}{barData.reduce((total, item) => total + item.value, 0).toFixed(2)}
        </Text>
      </View>
     

      <BarChart
        key={chartKey}
        data={barData}
        barWidth={18}
        height={90}
        width={290}
        minHeight={3}
        barBorderRadius={3}
        showGradient
        spacing={20}
        noOfSections={5}
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
          values={[`Income (${getIncomeCount()})`, `Expense (${getExpenseCount()})`]}
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
