import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import OnToggleDrawer from '../../partials/toggle-drawer';
import { getAllPosts } from "../../lib/appwrite";
import useAppwrite from '../../lib/useAppwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import { BarChart } from "react-native-gifted-charts";

import Card from '../../components/Transaction/ui/Card';
import { SummaryChart } from '../../components/Transaction'

const DisplayExpense = () => {
  const { user, globalCurrency } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite({ fn: () => getAllPosts(user?.$id) });

  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const [transactionsByDay, setTransactionsByDay] = useState({
    totalExpenses: 0,
    totalIncome: 0,
  });
  const [transactionsByWeek, setTransactionsByWeek] = useState([]);
  const [expensesByDay, setExpensesByDay] = useState([]);
  const [incomeByDay, setIncomeByDay] = useState([]);
  const [expenseCount, setExpenseCount] = useState(0);
  const [incomeCount, setIncomeCount] = useState(0);


  useEffect(() => {
    if (posts) {
      const expenses = posts.filter((transaction) => transaction.type === 'Expense');
      const income = posts.filter((transaction) => transaction.type === 'Income');
      
      setExpenseCount(expenses.length);
      setIncomeCount(income.length);
    }
  }, [posts]);

  useEffect(() => {
    if (posts) {
      //console.log('Raw Posts Data:', posts);
      const  { groupedByDay, totalExpenses, totalIncome } = posts.reduce((acc, transaction) => {
        const date = new Date(transaction.dateofpurchase);
        const day = date.getDay(); // 0 (Sun) to 6 (Sat)
        const year = date.getFullYear();
        //const week = getWeekNumber(date);

        const amount = parseFloat(transaction.ItemAmount);
        if (isNaN(amount)) {
          console.warn('Invalid amount:', transaction.ItemAmount);
          return acc;
        }
        //console.log(amount)

        if (!acc.groupedByDay[day]) {
          acc.groupedByDay[day] = { expenses: 0, income: 0 };
        }
  
        if (transaction.type === 'Expense') {
          acc.groupedByDay[day].expenses += amount;
          acc.totalExpenses += amount; // Sum up total expenses
        } else if (transaction.type === 'Income') {
          acc.groupedByDay[day].income += amount;
          acc.totalIncome += amount; // Sum up total income
        }
  
        return acc;
      }, { groupedByDay: {}, totalExpenses: 0, totalIncome: 0 });
  
      const daysArray = Array.from({ length: 7 }, (_, i) => groupedByDay[i] || { expenses: 0, income: 0 });
      //console.log('Days Array:', daysArray); // Debugging

      setExpensesByDay(daysArray.map(day => day.expenses));
      setIncomeByDay(daysArray.map(day => day.income));
      setExpenseCount(posts.filter(p => p.type === 'Expense').length);
      setIncomeCount(posts.filter(p => p.type === 'Income').length);

      setTransactionsByDay({ totalExpenses, totalIncome });

    }
  }, [posts]);
  

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 10, marginHorizontal:10, marginBottom: -50 }}>
      <View style={{ flex: 1 }}>
        <View className="flex-row mb-4 mt-3">
          <OnToggleDrawer />
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.subtitle}>Weekly Summary</Text>
          </View>
        </View>


        {/* <SearchInput /> */}

        <View className="mb-5">
        
          <TransactionSummary
            totalExpenses={transactionsByDay.totalExpenses}
            totalIncome={transactionsByDay.totalIncome}
            expenseCount={expenseCount}
            incomeCount={incomeCount}
            />
        </View>
          
        <ScrollView showsVerticalScrollIndicator={false}>

          <DailySummaryTable
            expensesByDay={expensesByDay}
            incomeByDay={incomeByDay}
            currency={globalCurrency.symbol}
          />

          <View style={{ flexDirection: 'row' }}>
            <View className="flex-col mt-6 ml-5">
              <Text style={{ width: 83, fontSize: 14, color: 'black', marginRight: 10 }} numberOfLines={1}>
                  Net Spending:
                </Text>
                <Text style={{ width: 83, fontSize: 14, color: 'black', marginRight: 10, paddingTop: 20 }}>
                  Net Income:
              </Text>
            </View>
             
              <View className="-mt-3 -mr-10 absolute left-12">
                <HorizontalBarChart 
                  netSpending={transactionsByDay.totalExpenses}
                  netIncome={transactionsByDay.totalIncome}
                />
              </View>
          </View>

    </ScrollView>

      </View>
    </SafeAreaView>
  );
};


function TransactionSummary({
  expenseCount, incomeCount
}) {
  return (
    <>
      <Card style={styles.container}>
        <SummaryChart numOfExpenses={expenseCount} numOfIncomes={incomeCount}/>
      </Card>
    </>
  );
}

function DailySummaryTable({ expensesByDay, incomeByDay, currency }) {
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={[styles.cell, styles.celli]}>Day</Text>
          <Text style={[styles.cell, styles.celli]}>Total Expenses</Text>
          <Text style={[styles.cell, styles.celli]}>Total Income</Text>
        </View>
        {dayLabels.map((day, index) => (
          <View key={index} style={styles.row}>
            <ColorCircle day={day} />
            <Text style={[styles.cell, styles.celli]}>{day}</Text>
            <Text style={[styles.cell, styles.totals]}>{currency} {expensesByDay[index] }</Text>
            <Text style={[styles.cell, styles.totals]}>{currency} {incomeByDay[index] }</Text>
          </View>
        ))}
      </View>
  )
}



function HorizontalBarChart({ netSpending, netIncome }) {
  const barData = [
    {
      value: netSpending,
      frontColor: 'red',
    },
    {
      value: netIncome,
      frontColor: '#20B54B',
      
    },
  ];
  //console.log(netIncome)
  return (
    <View className="-mt-5 -mr-20 absolute">
      <BarChart
          horizontal
          barWidth={22}
          width={300}
          barBorderRadius={4}
          frontColor="blue"
          data={barData}
          noOfVerticalLines={0}
          yAxisThickness={0}
          xAxisThickness={0}
          horizontalLinesSpacing={0}
          hideYAxisText={true}
          rulesColor="white"
          spacing={10}
          stepHeight={20}
      />
  </View>
  )
}


function ColorCircle ({ day }) {
  // Map days to colors
  const colors = {
    Sun: 'blue',
    Mon: 'red',
    Tue: 'green',
    Wed: 'orange',
    Thu: 'black',
    Fri: 'indigo',
    Sat: 'violet'
  };

  // Get the color based on the day
  const color = colors[day] || 'grey'; // Default to grey if the day is not found

  return (
    <View style={[styles.circle, { backgroundColor: color }]} className="absolute top-3.5 left-5" />
  );
};


const styles = StyleSheet.create({
  blur: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  subtitle: {
    fontWeight: 'bold', fontSize: 25, color: '#1F41BB', 
  },
  table: {
    borderColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    paddingLeft: -30,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  celli: {
    fontFamily: 'Brighter-Regular'
  },
  totals: {
    fontFamily: 'Poppins-SemiBold'
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 25,
  },
});

export default DisplayExpense;
