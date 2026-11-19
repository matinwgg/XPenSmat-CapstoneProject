import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import ScreenHeader from '../../components/ScreenHeader';
import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';
import ExpenseItem from '../../components/ExpenseAll';
import { getAllPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import {
  formatCurrency,
  groupTransactionsByCategory,
  sumAmounts,
} from '../../lib/format';
import { categoriesIcons } from '../../partials/categoryIcons';

const iconForCategory = (category) => {
  const match = categoriesIcons.categoriesWithIcons.find(
    (item) => item.category === category
  );
  return match ? match.icon : 'pricetag-outline';
};

const DisplayExpense = () => {
  const { user, globalCurrency } = useGlobalContext();
  const { data, isLoading, refetch } = useAppwrite({
    fn: () => getAllPosts(user?.$id),
  });
  const posts = Array.isArray(data) ? data : [];

  const [refreshing, setRefreshing] = useState(false);
  const listRef = useRef(null);
  const { bottom } = useSafeAreaInsets();

  const symbol = globalCurrency?.symbol || '';
  const currency = globalCurrency?.currency || '';

  const money = (value) =>
    formatCurrency(value, symbol ? { symbol } : { currency });

  const groups = useMemo(() => groupTransactionsByCategory(posts), [posts]);
  const totalSpent = useMemo(() => sumAmounts(posts, 'Expense'), [posts]);
  const totalIncome = useMemo(() => sumAmounts(posts, 'Income'), [posts]);
  const expenseCount = useMemo(
    () => posts.filter((item) => item?.type === 'Expense').length,
    [posts]
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const header = (
    <View>
      <ScreenHeader
        title="Transactions"
        subtitle="Every expense and income, grouped by category"
        right={
          <View className="px-2.5 py-1 rounded-lg bg-[#EEF2FF]">
            <Text className="text-[11px] font-psemibold text-[#1F41BB]">
              {posts.length}
            </Text>
          </View>
        }
      />

      <SearchInput />

      <View className="flex-row my-4">
        <View
          className="flex-1 rounded-2xl p-4 mr-3 justify-between"
          style={{ backgroundColor: '#1F41BB', minHeight: 108 }}
        >
          <View className="flex-row items-center justify-between">
            <Text
              className="text-[11px] font-psemibold uppercase"
              style={{ color: 'rgba(255,255,255,0.72)' }}
            >
              Total spent
            </Text>
            <Ionicons name="arrow-up" size={15} color="#FFFFFF" />
          </View>
          <Text
            className="text-[20px] font-pbold text-white mt-2"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {money(totalSpent)}
          </Text>
          <Text
            className="text-[11px] font-pregular mt-0.5"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            {expenseCount} expense{expenseCount === 1 ? '' : 's'}
          </Text>
        </View>

        <View className="flex-1 rounded-2xl p-4 bg-white justify-between" style={{ minHeight: 108 }}>
          <View className="flex-row items-center justify-between">
            <Text className="text-[11px] font-psemibold uppercase text-[#64748B]">
              Total earned
            </Text>
            <Ionicons name="arrow-down" size={15} color="#16A34A" />
          </View>
          <Text
            className="text-[20px] font-psemibold text-[#0F172A] mt-2"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {money(totalIncome)}
          </Text>
          <Text className="text-[11px] font-pregular text-[#94A3B8] mt-0.5">
            {posts.length - expenseCount} income
          </Text>
        </View>
      </View>

      {isLoading && posts.length === 0 ? (
        <ActivityIndicator color="#1F41BB" style={{ marginTop: 8 }} />
      ) : null}

      {groups.length > 0 ? (
        <Text className="text-[13px] font-pmedium text-[#64748B] mb-2">
          {groups.length} categor{groups.length === 1 ? 'y' : 'ies'}
        </Text>
      ) : null}
    </View>
  );

  const renderGroup = ({ item: group }) => (
    <View
      className="bg-white rounded-2xl px-4 py-3 mb-4"
      style={{
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 1,
      }}
    >
      <View className="flex-row items-center">
        <View className="w-9 h-9 rounded-xl bg-[#EEF2FF] items-center justify-center">
          <Ionicons name={iconForCategory(group.category)} size={18} color="#1F41BB" />
        </View>
        <View className="flex-1 ml-3">
          <Text
            className="text-[15px] font-psemibold text-[#0F172A]"
            numberOfLines={1}
          >
            {group.category}
          </Text>
          <Text className="text-[11px] font-pregular text-[#64748B] mt-0.5">
            {group.count} transaction{group.count === 1 ? '' : 's'}
          </Text>
        </View>
        <Text className="text-[13px] font-psemibold text-[#0F172A]">
          {money(group.total)}
        </Text>
      </View>

      <View className="mt-1">
        {group.items.map((transaction, index) => (
          <View
            key={transaction.$id || `${group.category}-${index}`}
            style={
              index > 0
                ? { borderTopWidth: 1, borderTopColor: '#F1F5F9' }
                : undefined
            }
          >
            <ExpenseItem expenseData={transaction} />
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F5F7FB]" edges={['top']}>
      <View className="flex-1 px-4">
        <FlatList
          ref={listRef}
          data={groups}
          keyExtractor={(item) => item.category}
          renderItem={renderGroup}
          ListHeaderComponent={header}
          ListEmptyComponent={() => (
            <EmptyState
              title="No transactions yet"
              subtitle="Record an expense or income to start building your history."
              actionLabel="Add transaction"
              onAction={() => router.push('/add-expense')}
              icon="receipt-outline"
            />
          )}
          contentContainerStyle={{ paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#1F41BB"
              colors={['#1F41BB']}
            />
          }
        />
      </View>

      {groups.length > 0 ? (
        <TouchableOpacity
          onPress={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
          activeOpacity={0.9}
          className="absolute right-5 w-12 h-12 rounded-full bg-[#1F41BB] items-center justify-center"
          style={{
            bottom: bottom + 24,
            shadowColor: '#1F41BB',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 4,
          }}
          accessibilityRole="button"
          accessibilityLabel="Scroll to top"
        >
          <Ionicons name="arrow-up" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      ) : null}
    </SafeAreaView>
  );
};

export default DisplayExpense;
