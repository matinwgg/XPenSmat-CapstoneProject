import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import ScreenHeader from '../../components/ScreenHeader';
import EmptyState from '../../components/EmptyState';
import Card from '../../components/Transaction/ui/Card';
import { SummaryChart } from '../../components/Transaction';
import { getAllPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import { formatCurrency, sumAmounts, toNumber } from '../../lib/format';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_COLORS = [
  '#1F41BB',
  '#F97316',
  '#16A34A',
  '#8B5CF6',
  '#0EA5E9',
  '#EC4899',
  '#F59E0B',
];

const DisplayExpense = () => {
  const { user, globalCurrency } = useGlobalContext();
  const { data, isLoading } = useAppwrite({
    fn: () => getAllPosts(user?.$id),
  });
  const posts = Array.isArray(data) ? data : [];

  const symbol = globalCurrency?.symbol || '';
  const currency = globalCurrency?.currency || '';
  const money = (value) =>
    formatCurrency(value, symbol ? { symbol } : { currency });

  const { byDay, totalExpenses, totalIncome } = useMemo(() => {
    const days = DAY_LABELS.map(() => ({ expenses: 0, income: 0 }));

    posts.forEach((transaction) => {
      const date = new Date(String(transaction?.dateofpurchase || '').split('T')[0]);
      if (Number.isNaN(date.getTime())) return;

      const day = date.getDay();
      const amount = toNumber(transaction?.ItemAmount);
      if (transaction?.type === 'Expense') days[day].expenses += amount;
      if (transaction?.type === 'Income') days[day].income += amount;
    });

    return {
      byDay: days,
      totalExpenses: sumAmounts(posts, 'Expense'),
      totalIncome: sumAmounts(posts, 'Income'),
    };
  }, [posts]);

  const maxFlow = Math.max(totalExpenses, totalIncome, 1);
  const spentPercent = Math.round((totalExpenses / maxFlow) * 100);
  const incomePercent = Math.round((totalIncome / maxFlow) * 100);
  const incomeShare =
    totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : null;

  return (
    <SafeAreaView className="flex-1 bg-[#F5F7FB]" edges={['top']}>
      <View className="flex-1 px-4">
        <ScreenHeader
          title="Statistics"
          subtitle="Your spending at a glance"
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Card className="mb-4">
            <SummaryChart />
          </Card>

          {isLoading && posts.length === 0 ? (
            <ActivityIndicator color="#1F41BB" style={{ marginTop: 12 }} />
          ) : null}

          {posts.length === 0 && !isLoading ? (
            <View className="bg-white rounded-2xl">
              <EmptyState
                title="No data to analyse"
                subtitle="Add a few transactions and your weekly patterns will appear here."
                actionLabel="Add transaction"
                onAction={() => router.push('/add-expense')}
                icon="bar-chart-outline"
              />
            </View>
          ) : (
            <>
              <View
                className="bg-white rounded-2xl p-4 mb-4"
                style={{
                  shadowColor: '#0F172A',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.05,
                  shadowRadius: 10,
                  elevation: 1,
                }}
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View>
                    <Text className="text-[16px] font-psemibold text-[#0F172A]">
                      By weekday
                    </Text>
                    <Text className="text-[11px] font-pregular text-[#64748B] mt-0.5">
                      All recorded transactions
                    </Text>
                  </View>
                  <View className="w-8 h-8 rounded-lg bg-[#EEF2FF] items-center justify-center">
                    <Ionicons name="calendar-outline" size={16} color="#1F41BB" />
                  </View>
                </View>

                <View className="flex-row pb-2 border-b border-[#F1F5F9]">
                  <Text className="flex-1 text-[11px] font-pmedium text-[#94A3B8]">
                    DAY
                  </Text>
                  <Text className="w-24 text-right text-[11px] font-pmedium text-[#94A3B8]">
                    SPENT
                  </Text>
                  <Text className="w-24 text-right text-[11px] font-pmedium text-[#94A3B8]">
                    EARNED
                  </Text>
                </View>

                {byDay.map((day, index) => (
                  <View
                    key={DAY_LABELS[index]}
                    className="flex-row items-center py-2.5 border-b border-[#F8FAFC]"
                  >
                    <View className="flex-1 flex-row items-center">
                      <View
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: DAY_COLORS[index] }}
                      />
                      <Text className="text-[13px] font-pregular text-[#0F172A]">
                        {DAY_LABELS[index]}
                      </Text>
                    </View>
                    <Text
                      className="w-24 text-right text-[12px] font-psemibold"
                      style={{ color: day.expenses > 0 ? '#DC2626' : '#CBD5E1' }}
                      numberOfLines={1}
                    >
                      {money(day.expenses)}
                    </Text>
                    <Text
                      className="w-24 text-right text-[12px] font-psemibold"
                      style={{ color: day.income > 0 ? '#16A34A' : '#CBD5E1' }}
                      numberOfLines={1}
                    >
                      {money(day.income)}
                    </Text>
                  </View>
                ))}
              </View>

              <View
                className="bg-white rounded-2xl p-4 mb-4"
                style={{
                  shadowColor: '#0F172A',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.05,
                  shadowRadius: 10,
                  elevation: 1,
                }}
              >
                <View className="flex-row items-center justify-between mb-4">
                  <View>
                    <Text className="text-[16px] font-psemibold text-[#0F172A]">
                      Cash flow
                    </Text>
                    <Text className="text-[11px] font-pregular text-[#64748B] mt-0.5">
                      Expenses compared with income
                    </Text>
                  </View>
                  <View className="w-8 h-8 rounded-lg bg-[#EEF2FF] items-center justify-center">
                    <Ionicons name="swap-vertical" size={16} color="#1F41BB" />
                  </View>
                </View>

                <Text className="text-[11px] font-pregular text-[#64748B] mb-1.5">
                  Spent
                </Text>
                <View className="flex-row items-center mb-3">
                  <View className="flex-1 h-2.5 rounded-full bg-[#FEE2E2] overflow-hidden mr-3">
                    <View
                      className="h-2.5 rounded-full bg-[#DC2626]"
                      style={{ width: `${spentPercent}%` }}
                    />
                  </View>
                  <Text className="text-[12px] font-psemibold text-[#0F172A] w-24 text-right">
                    {money(totalExpenses)}
                  </Text>
                </View>

                <Text className="text-[11px] font-pregular text-[#64748B] mb-1.5">
                  Earned
                </Text>
                <View className="flex-row items-center">
                  <View className="flex-1 h-2.5 rounded-full bg-[#DCFCE7] overflow-hidden mr-3">
                    <View
                      className="h-2.5 rounded-full bg-[#16A34A]"
                      style={{ width: `${incomePercent}%` }}
                    />
                  </View>
                  <Text className="text-[12px] font-psemibold text-[#0F172A] w-24 text-right">
                    {money(totalIncome)}
                  </Text>
                </View>

                {incomeShare !== null ? (
                  <View className="flex-row items-start bg-[#F8FAFC] rounded-xl p-3 mt-4">
                    <Ionicons
                      name={incomeShare > 100 ? 'alert-circle-outline' : 'bulb-outline'}
                      size={16}
                      color={incomeShare > 100 ? '#D97706' : '#1F41BB'}
                      style={{ marginTop: 1 }}
                    />
                    <Text className="flex-1 text-[12px] font-pregular text-[#475569] ml-2 leading-5">
                      {incomeShare > 100
                        ? `You've spent ${incomeShare}% of your recorded income.`
                        : `You've kept ${100 - incomeShare}% of your recorded income.`}
                    </Text>
                  </View>
                ) : null}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DisplayExpense;
