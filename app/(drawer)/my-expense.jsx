import { StyleSheet, Button, Text, View, SafeAreaView, RefreshControl, TouchableOpacity, ScrollView } from 'react-native';
import { FlatList } from 'react-native'; // Correct import
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { BlurView } from "expo-blur";
import { SymbolView } from "expo-symbols";
import OnToggleDrawer from '../../partials/toggle-drawer';
import { getAllPosts } from "../../lib/appwrite";
import useAppwrite from '../../lib/useAppwrite';
import CustomButton from '../../components/CustomButton';
import EmptyState from '../../components/EmptyState';
import ExpenseItem from '../../components/ExpenseAll';
import { useGlobalContext } from '../../context/GlobalProvider';
import SearchInput from '../../components/SearchInput';

//import TransactionList  from "../../components/Transaction/TransactionsList";
import Card from '../../components/Transaction/ui/Card';
import { SummaryChart } from '../../components/Transaction'

const DisplayExpense = () => {
  const { user } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite({ fn: () => getAllPosts(user?.$id) });

  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const [transactionsByDay, setTransactionsByDay] = useState({
    totalExpenses: 0,
    totalIncome: 0,
  });
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };


  const deleteTransaction = () => {};

  const groupByCategory = (expenses) => {
    if (!expenses || expenses.length === 0) {
      return {}; // Return an empty object if expenses is undefined or empty
    }
    return expenses.reduce((groups, expense) => {
      const { category } = expense;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(expense);
      return groups;
    }, {});
  };

const ExpenseCard = ({ category, expenses }) => (
  <Card style={{ marginBottom: 40}}>
      <Text className="font-pbold justify-start text-3xl mb-2">{category}</Text> 
      {expenses.map((expense) => (
      <ExpenseItem key={expense.$id} expenseData={expense} />
    ))}
  </Card>
);

const groupedExpenses = groupByCategory(posts);
  const xcategories = Object.keys(groupedExpenses);

  useEffect(() => {
    const now = new Date();
    // Set to the first day of the current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // Get the first day of the next month, then subtract one millisecond to get the end of the current month
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    endOfMonth.setMilliseconds(endOfMonth.getMilliseconds() - 1);

    // Convert to Unix timestamps (seconds)
    const startOfMonthTimestamp = Math.floor(startOfMonth.getTime() / 1000);
    const endOfMonthTimestamp = Math.floor(endOfMonth.getTime() / 1000);

    const result = [
      { name: 'Utilities', type: 'Expense' },
      { name: 'Electronics', type: 'Expense' },
      { name: 'Dining Out', type: 'Expense' },
      { name: 'Breakfast Supplies', type: 'Expense' },
      { name: 'Household Items', type: 'Expense' },
      { name: 'Christmas Gifts', type: 'Expense' },
      { name: 'New Year Party Supplies', type: 'Expense' },
      { name: 'Thanksgiving Groceries', type: 'Expense' },
      { name: 'Bonus', type: 'Income' },
      { name: 'Consulting Work', type: 'Income' },
      { name: 'Part-time Job', type: 'Income' },
      { name: 'Online Sales', type: 'Income' },
      { name: 'Freelance Writing', type: 'Income' },
      { name: 'End of Year Bonus', type: 'Income' },
      { name: 'Thanksgiving Freelance', type: 'Income' }
  ]
    setTransactions(result);

    const categoriesResult =  [
    { category_id: 1, amount: 100.50, date: 1709814000, description: 'Weekly groceries', type: 'Expense' },
    { category_id: 1, amount: 75.25, date: 1709900400, description: 'More groceries', type: 'Expense' },
    { category_id: 2, amount: 1200, date: 1707740400, description: 'Monthly rent', type: 'Expense' },
    { category_id: 1, amount: 45.99, date: 1710082800, description: 'Snacks and drinks', type: 'Expense' },
    { category_id: 1, amount: 60.00, date: 1707154800, description: 'Breakfast supplies', type: 'Expense' },
    { category_id: 1, amount: 110.75, date: 1707241200, description: 'Household items', type: 'Expense' },
    { category_id: 2, amount: 50.25, date: 1707327600, description: 'Utilities bill', type: 'Expense' },
    { category_id: 1, amount: 200.50, date: 1707414000, description: 'Electronics', type: 'Expense' },
    { category_id: 1, amount: 15.99, date: 1707500400, description: 'Dining out', type: 'Expense' },
    { category_id: 1, amount: 90.00, date: 1704562800, description: 'Christmas Gifts', type: 'Expense' },
    { category_id: 1, amount: 120.75, date: 1704649200, description: 'New Year Party Supplies', type: 'Expense' },
    { category_id: 1, amount: 85.50, date: 1701970800, description: 'Thanksgiving Groceries', type: 'Expense' },
    { category_id: 2, amount: 900, date: 1702057200, description: 'Rent November', type: 'Expense' },
    { category_id: 3, amount: 3000, date: 1709914800, description: 'Monthly salary', type: 'Income' },
    { category_id: 4, amount: 500, date: 1710001200, description: 'Freelance project', type: 'Income' },
    { category_id: 3, amount: 3200, date: 1707266800, description: 'Bonus', type: 'Income' },
    { category_id: 4, amount: 450, date: 1707353200, description: 'Consulting work', type: 'Income' },
    { category_id: 3, amount: 2800, date: 1707439600, description: 'Part-time job', type: 'Income' },
    { category_id: 4, amount: 600, date: 1707526000, description: 'Online sales', type: 'Income' },
    { category_id: 3, amount: 1500, date: 1707612400, description: 'Freelance writing', type: 'Income' },
    { category_id: 3, amount: 3100, date: 1704675600, description: 'End of Year Bonus', type: 'Income' },
    { category_id: 4, amount: 700, date: 1702083600, description: 'Thanksgiving Freelance', type: 'Income' },
    ]
    // Income Transactions
    setCategories(categoriesResult);

    const transactionsByDay = {
      totalExpenses: 2375.24, 
      totalIncome: 10050.00,  
    };
    setTransactionsByDay(transactionsByDay);
  

  }, [])

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 10, marginHorizontal:10 }}>
      <View style={{ flex: 1 }}>
        <View>
          <OnToggleDrawer />
        </View>

        {/* <SearchInput /> */}

        <View className="mb-5">
        <View style={{ alignItems: '', marginBottom: 10, marginTop: 10 }}>
            <Text style={styles.subtitle}>Statistics</Text>
          </View>
          <TransactionSummary
            totalExpenses={transactionsByDay.totalExpenses}
            totalIncome={transactionsByDay.totalIncome}
          />
        </View>
        {/* <TransactionList
          categories={categories}
          transactions={transactions}
          deleteTransaction={deleteTransaction}
        /> */}
        
          <View style={{ alignItems: '', marginBottom: 5 }}>
            <Text style={ styles.subtitle }>Transaction history</Text>
          </View>

        <FlatList
          data={xcategories}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item: category }) => 
            <ExpenseCard category={category} expenses={groupedExpenses[category]} />
        }
          ListEmptyComponent={() => <EmptyState title="No Expense Available" subtitle="You have no purchases" />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />

      </View>


      <BlurView
        intensity={90}
        tint="light"
        style={styles.blur}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: 'gray' }}>Lifetime savings</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 28 }}>$123,823.50</Text>
          </View>
          <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
            <SymbolView
              size={48}
              type="palette"
              name="checkmark.circle"
              colors={["black", "transparent"]}
              style={{ backgroundColor: "#00000010", borderRadius: 50 }}
            />
          </TouchableOpacity>
        </View>
      </BlurView>
    </SafeAreaView>
  );
};


function TransactionSummary({
  totalIncome,
  totalExpenses,
}) {
  const savings = totalIncome - totalExpenses;
  const readablePeriod = new Date().toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });

  // Function to determine the style based on the value (positive or negative)
  const getMoneyTextStyle = (value)=> ({
    fontWeight: "bold",
    color: value < 0 ? "#ff4500" : "#2e8b57", // Red for negative, custom green for positive
  });

  // Helper function to format monetary values
  const formatMoney = (value) => {
    const absValue = Math.abs(value).toFixed(2);
    return `${value < 0 ? "-" : ""}$${absValue}`;
  };

  return (
    <>
      <Card style={styles.container}>
        {/* <Text style={styles.periodTitle}>Summary for {readablePeriod}</Text> */}
        <SummaryChart />
        {/* <Text style={styles.summaryText}>
          Income:{" "}
          <Text style={getMoneyTextStyle(totalIncome)}>
            {formatMoney(totalIncome)}
          </Text>
        </Text>
        <Text style={styles.summaryText}>
          Total Expenses:{" "}
          <Text style={getMoneyTextStyle(totalExpenses)}>
            {formatMoney(totalExpenses)}
          </Text>
        </Text>
        <Text style={styles.summaryText}>
          Savings:{" "}
          <Text style={getMoneyTextStyle(savings)}>{formatMoney(savings)}</Text>
        </Text> */}
      </Card>
    </>
  );
}

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
  }
});

export default DisplayExpense;
