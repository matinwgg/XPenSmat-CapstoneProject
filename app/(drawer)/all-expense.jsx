import { StyleSheet, Button, Text, View, SafeAreaView, RefreshControl, TouchableOpacity, ScrollView } from 'react-native';
import { FlatList } from 'react-native'; // Correct import
import React, { useEffect, useState } from 'react';
import { BlurView } from "expo-blur";
import { SymbolView } from "expo-symbols";
import OnToggleDrawer from '../../partials/toggle-drawer';
import { getAllPosts } from "../../lib/appwrite";
import useAppwrite from '../../lib/useAppwrite';
import EmptyState from '../../components/EmptyState';
import ExpenseItem from '../../components/ExpenseAll';
import { useGlobalContext } from '../../context/GlobalProvider';

import Card from '../../components/Transaction/ui/Card';

const DisplayExpense = () => {
  const { user, globalCurrency } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite({ fn: () => getAllPosts(user?.$id) });

  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [transactionsByDay, setTransactionsByDay] = useState({
    totalExpenses: 0,
    totalIncome: 0,
  });
  
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    try {
      let total = 0;
      // Filter posts to include only those with type 'Expenses'
      const expenseItems = posts.filter(item => item.type === 'Expense');

  
      // Sum up the ItemAmount of filtered items
      expenseItems.forEach(item => {
        total += item.ItemAmount;
      });
  
      setTotalAmount(total);
    } catch (error) {
      // Handle the error if needed
      console.log("Error calculating total amount:", error);
    }
  }, [posts]);
  


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
      {expenses.map((item) => (
      <ExpenseItem key={item.$id} expenseData={item} />
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


    const transactionsByDay = {
      totalExpenses: 2375.24, 
      totalIncome: 10050.00,  
    };
    setTransactionsByDay(transactionsByDay);
  

  }, [])

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 10, marginHorizontal:10 }}>
      <View style={{ flex: 1, }}>
        <View className="flex-row">
          <OnToggleDrawer />
          <View style={{ alignItems: '', marginBottom: 5, left: 60 }}>
            <Text style={ styles.subtitle }>Transaction history</Text>
          </View>
        </View>

        {/* <SearchInput /> */}

        <View className="mb-5">
        </View>
        
          

        <FlatList
          data={xcategories}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item: category }) => 
            <ExpenseCard 
              category={category} 
              expenses={groupedExpenses[category]} 
            />
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
            <Text style={{ color: 'gray' }}>Overall Expense</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 28 }}>{globalCurrency.symbol} {totalAmount.toFixed(2)}</Text>
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
