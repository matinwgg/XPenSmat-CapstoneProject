import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Drawer } from 'expo-router/drawer';
import { router, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useGlobalContext } from '../../../../context/GlobalProvider';
import { images } from '../../../../constants';
import { getRecentPosts, getAccount } from '../../../../lib/appwrite';
import useAppwrite from '../../../../lib/useAppwrite';
import {
  formatCurrency,
  getDisplayName,
  getGreeting,
  sumAmounts,
} from '../../../../lib/format';
import Expense from '../../../../components/ExpenseItem';
import EmptyState from '../../../../components/EmptyState';
import CustomCalendar from '../../../../components/CustomCalendar';

const Home = () => {
  const { user, globalCurrency, setIsUserVerified } = useGlobalContext();

  const { data, isLoading, refetch } = useAppwrite({
    fn: () => getRecentPosts(user?.$id),
  });

  const recentPosts = Array.isArray(data) ? data : [];
  const [refreshing, setRefreshing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(0);

  const symbol = globalCurrency?.symbol || '';
  const toCurrency = globalCurrency?.currency || 'GHS';

  const expensePosts = useMemo(
    () => recentPosts.filter((post) => post?.type === 'Expense'),
    [recentPosts]
  );
  const totalSpent = useMemo(() => sumAmounts(expensePosts, 'Expense'), [expensePosts]);

  const money = (value) =>
    formatCurrency(value, symbol ? { symbol } : { currency: toCurrency });

  const navigation = useNavigation();

  const toggleDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  useEffect(() => {
    let isMounted = true;

    const verifyUser = async () => {
      try {
        const account = await getAccount();
        const verified = Boolean(account?.emailVerification);
        if (isMounted) {
          setIsVerified(verified);
          setIsUserVerified(verified);
        }
      } catch (error) {
        if (isMounted) setIsVerified(false);
      }
    };

    verifyUser();
    return () => {
      isMounted = false;
    };
  }, [setIsUserVerified]);

  useEffect(() => {
    let isMounted = true;

    const loadRate = async () => {
      try {
        const response = await fetch(
          'https://v6.exchangerate-api.com/v6/0e6303693a5b845f4814341f/latest/USD'
        );
        const payload = await response.json();
        const rate = Number(payload?.conversion_rates?.[toCurrency]);
        if (isMounted) setExchangeRate(Number.isFinite(rate) ? rate : 0);
      } catch (error) {
        if (isMounted) setExchangeRate(0);
      }
    };

    loadRate();
    return () => {
      isMounted = false;
    };
  }, [toCurrency]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const openVerification = () => {
    router.push({
      pathname: '/settings/verify-email',
      params: { email: user?.email },
    });
  };

  const header = (
    <View>
      <View className="flex-row items-center mt-2 mb-5">
        <TouchableOpacity
          onPress={toggleDrawer}
          activeOpacity={0.8}
          className="w-11 h-11 rounded-full border-2 border-white overflow-hidden"
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          <Image
            source={images.profile_picture}
            className="w-full h-full"
            resizeMode="cover"
          />
        </TouchableOpacity>

        <View className="flex-1 ml-3">
          <Text className="text-[12px] font-pregular text-[#64748B]">
            {getGreeting()}
          </Text>
          <Text
            className="text-[20px] font-psemibold text-[#0F172A] mt-0.5"
            numberOfLines={1}
          >
            {getDisplayName(user)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={openVerification}
          activeOpacity={0.8}
          disabled={isVerified}
          style={{ backgroundColor: isVerified ? '#DCFCE7' : '#FEF3C7' }}
          className="flex-row items-center px-3 py-1.5 rounded-full"
          accessibilityRole="button"
          accessibilityLabel={isVerified ? 'Email verified' : 'Verify your email'}
        >
          <Ionicons
            name={isVerified ? 'shield-checkmark' : 'alert-circle'}
            size={14}
            color={isVerified ? '#16A34A' : '#B45309'}
          />
          <Text
            className="ml-1 text-[11px] font-psemibold"
            style={{ color: isVerified ? '#16A34A' : '#B45309' }}
          >
            {isVerified ? 'Verified' : 'Verify'}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row mb-4">
        <View
          className="flex-1 rounded-2xl p-4 mr-3 justify-between"
          style={{ backgroundColor: '#1F41BB', minHeight: 138 }}
        >
          <View className="flex-row items-center justify-between">
            <View
              className="w-9 h-9 rounded-xl items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
            >
              <Ionicons name="wallet-outline" size={18} color="#FFFFFF" />
            </View>
            <Text
              className="text-[10px] font-psemibold uppercase"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Recent
            </Text>
          </View>
          <Text
            className="text-[12px] font-pregular mt-3"
            style={{ color: 'rgba(255,255,255,0.78)' }}
          >
            Total spent
          </Text>
          <Text
            className="text-[24px] font-pbold text-white mt-0.5"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {money(totalSpent)}
          </Text>
          <Text
            className="text-[11px] font-pregular mt-0.5"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            {expensePosts.length} transaction{expensePosts.length === 1 ? '' : 's'}
          </Text>
        </View>

        <View
          className="flex-1 rounded-2xl bg-white p-4 justify-between"
          style={{ minHeight: 138 }}
        >
          <View className="flex-row items-center justify-between">
            <View className="w-9 h-9 rounded-xl bg-[#EEF2FF] items-center justify-center">
              <Ionicons name="cash-outline" size={18} color="#1F41BB" />
            </View>
            <View className="flex-row items-center">
              <View className="w-1.5 h-1.5 rounded-full bg-[#16A34A] mr-1" />
              <Text className="text-[10px] font-pmedium text-[#64748B]">Live</Text>
            </View>
          </View>
          <Text className="text-[12px] font-pregular text-[#64748B] mt-3">
            Exchange rate
          </Text>
          <Text
            className="text-[17px] font-psemibold text-[#0F172A] mt-0.5"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            1 USD = {toCurrency} {exchangeRate.toFixed(2)}
          </Text>
          <Text className="text-[11px] font-pregular text-[#94A3B8] mt-0.5">
            Updated just now
          </Text>
        </View>
      </View>

      <View
        className="bg-white rounded-2xl pt-2 pb-1 mb-5"
        style={{
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
          elevation: 2,
        }}
      >
        <CustomCalendar />
      </View>

      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-[18px] font-psemibold text-[#0F172A]">
          Recent expenses
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/all-expense')}
          activeOpacity={0.7}
          className="flex-row items-center px-2 py-1"
          accessibilityRole="button"
        >
          <Text className="font-psemibold text-[12px] text-[#1F41BB]">
            See all
          </Text>
          <Ionicons name="chevron-forward" size={14} color="#1F41BB" />
        </TouchableOpacity>
      </View>

      {isLoading && recentPosts.length === 0 ? (
        <ActivityIndicator color="#1F41BB" style={{ marginTop: 12 }} />
      ) : null}
    </View>
  );

  return (
    <>
      <Drawer.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <SafeAreaView className="flex-1 bg-[#F5F7FB]" edges={['top']}>
        <FlatList
          data={expensePosts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <Expense
              amount={item.ItemAmount}
              item={item.item}
              category={item.category}
              expenseType={item.type}
              purchaseDate={item.dateofpurchase}
              index={item.$id}
              onDeleted={refetch}
            />
          )}
          ListHeaderComponent={header}
          ListEmptyComponent={() => (
            <EmptyState
              title="No expenses yet"
              subtitle="Add your first transaction and it will show up here."
              actionLabel="Add transaction"
              onAction={() => router.push('/add-expense')}
              icon="wallet-outline"
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 120,
          }}
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
      </SafeAreaView>
    </>
  );
};

export default Home;
