import React, { useState, useEffect } from "react";
import {
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import TransactionList from "../components/TransactionsList";
import Card from "../components/ui/Card";
import SummaryChart from "../components/SummaryChart";
import { BlurView } from "expo-blur";
import { SymbolView } from "expo-symbols";
import { useGlobalContext } from '../../context/GlobalProvider';
import useAppwrite from "../../lib/useAppwrite"
import { getAllPosts } from '../../lib/appwrite'

export default function Stats() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transactionsByMonth, setTransactionsByMonth] = useState({
    totalExpenses: 0,
    totalIncome: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useGlobalContext()

  const { data: posts } = useAppwrite({
    fn: () => getPostsStats(user?.$id)
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const transactionResult = await useAppwrite({
            fn: () => getPostsStats(user?.$id)
          });

        setTransactions(transactionResult.documents);

        const categoryResult = await useAppwrite({
            fn: () => getAllPosts(user?.$id)
          });
        setCategories(categoryResult.documents);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        endOfMonth.setMilliseconds(endOfMonth.getMilliseconds() - 1);

        const startOfMonthTimestamp = Math.floor(startOfMonth.getTime() / 1000);
        const endOfMonthTimestamp = Math.floor(endOfMonth.getTime() / 1000);

        const expensesResult = await databases.listDocuments(
          '[YOUR_DATABASE_ID]',
          '[YOUR_TRANSACTION_COLLECTION_ID]',
          [
            {
              key: 'date',
              range: {
                start: startOfMonthTimestamp,
                end: endOfMonthTimestamp,
              },
            },
          ]
        );
        const totalExpenses = expensesResult.documents.reduce((total, doc) => {
          return doc.type === 'Expense' ? total + doc.amount : total;
        }, 0);

        const totalIncome = expensesResult.documents.reduce((total, doc) => {
          return doc.type === 'Income' ? total + doc.amount : total;
        }, 0);

        setTransactionsByMonth({
          totalExpenses,
          totalIncome,
        });
      } catch (error) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function deleteTransaction(id) {
    try {
      await databases.deleteDocument('[YOUR_DATABASE_ID]', '[YOUR_TRANSACTION_COLLECTION_ID]', id);
      await fetchData();
    } catch (error) {
      setError("Failed to delete transaction");
    }
  }

  async function insertTransaction(transaction) {
    try {
      await databases.createDocument(
        '[YOUR_DATABASE_ID]',
        '[YOUR_TRANSACTION_COLLECTION_ID]',
        'unique()',
        transaction
      );
      await fetchData();
    } catch (error) {
      setError("Failed to insert transaction");
    }
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          padding: 15,
          paddingVertical: Platform.OS === "ios" ? 170 : 16,
        }}
      >
        {/* <AddTransaction insertTransaction={insertTransaction} /> */}
        <TransactionSummary
          totalExpenses={transactionsByMonth.totalExpenses}
          totalIncome={transactionsByMonth.totalIncome}
        />
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>{error}</Text>
        ) : (
          <TransactionList
            categories={categories}
            transactions={transactions}
            deleteTransaction={deleteTransaction}
          />
        )}
      </ScrollView>
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        intensity={90}
        tint={"light"}
        style={styles.blur}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ color: "gray" }}>Lifetime savings</Text>
            <Text style={{ fontWeight: "bold", fontSize: 28 }}>
              $123,823.50
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Payment")}
          >
            <SymbolView
              size={48}
              type="palette"
              name="checkmark.circle"
              colors={["black", "transparent"]}
              style={{ backgroundColor: "#00000010", borderRadius: 50 }}
              fallback={
                <Button
                  title="open"
                  onPress={() => navigation.navigate("Payment")}
                />
              }
            />
          </TouchableOpacity>
        </View>
      </BlurView>
    </>
  );
}

function TransactionSummary({ totalIncome, totalExpenses }) {
  const savings = totalIncome - totalExpenses;
  const readablePeriod = new Date().toLocaleDateString("default", {
    month: "long",
    year: "numeric", 
  });

  const getMoneyTextStyle = (value) => ({
    fontWeight: "bold",
    color: value < 0 ? "#ff4500" : "#2e8b57",
  });

  const formatMoney = (value) => {
    const absValue = Math.abs(value).toFixed(2);
    return `${value < 0 ? "-" : ""}$${absValue}`;
  };

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingBottom: 7,
  },
  blur: {
    width: "100%",
    height: 110,
    position: "absolute",
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: "#00000010",
    padding: 16,
  },
  periodTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
});
