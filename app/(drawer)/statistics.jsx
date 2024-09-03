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
  const [expenseCount, setExpenseCount] = useState(0);
  const [incomeCount, setIncomeCount] = useState(0);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };


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
    if (posts) {
      const expenses = posts.filter((transaction) => transaction.type === 'Expense');
      const income = posts.filter((transaction) => transaction.type === 'Income');
      
      setExpenseCount(expenses.length);
      setIncomeCount(income.length);
    }
  }, [posts]);

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 10, marginHorizontal:10, marginBottom: -50 }}>
      <ScrollView>
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
        
          <View style={{ alignItems: 'center', marginBottom: 5 }}>
            <Text style={ styles.subtitle }>Transaction history </Text>
          </View>

        {/* <FlatList
          data={xcategories}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item: category }) => 
            <ExpenseCard category={category} expenses={groupedExpenses[category]} />
        }
          ListEmptyComponent={() => <EmptyState title="No Expense Available" subtitle="You have no purchases" />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        /> */}

        

      </View>
    </ScrollView>
    </SafeAreaView>
  );
};


function TransactionSummary({
  totalIncome,
  totalExpenses,
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

function Interpretation() {
  return (
    <View>

    </View>
  )
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
