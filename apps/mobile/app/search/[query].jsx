import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import useAppwrite from '../../lib/useAppwrite';
import { searchPosts } from '../../lib/appwrite';
import { EmptyState, SearchInput } from '../../components';
import ExpenseItem from '../../components/ExpenseAll';
import { sumAmounts } from '../../lib/format';
import { useGlobalContext } from '../../context/GlobalProvider';

const Search = () => {
  const { query } = useLocalSearchParams();
  const { globalCurrency } = useGlobalContext();
  const searchTerm = Array.isArray(query) ? query[0] : query;

  const { data: posts, isLoading, refetch } = useAppwrite(() =>
    searchPosts(searchTerm)
  );

  const results = Array.isArray(posts) ? posts : [];

  useEffect(() => {
    refetch();
    // Re-run the search whenever the route parameter changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const totalSpent = useMemo(() => sumAmounts(results, 'Expense'), [results]);

  return (
    <SafeAreaView className="flex-1 bg-[#F5F7FB]" edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Search',
          headerShown: true,
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTitleStyle: { fontFamily: 'Poppins-SemiBold' },
          headerTintColor: '#0F172A',
        }}
      />

      <View className="flex-1 px-4">
        <View className="pt-3 pb-4">
          <SearchInput initialQuery={searchTerm} />
        </View>

        <FlatList
          data={results}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="bg-white rounded-xl px-4 mb-2">
              <ExpenseItem expenseData={item} />
            </View>
          )}
          ListHeaderComponent={
            <View className="mb-3">
              <Text className="text-[12px] font-pregular text-[#64748B]">
                {isLoading
                  ? 'Searching…'
                  : `${results.length} result${
                      results.length === 1 ? '' : 's'
                    } for`}
              </Text>
              <Text
                className="text-[20px] font-psemibold text-[#0F172A] mt-0.5"
                numberOfLines={2}
              >
                “{searchTerm || 'Everything'}”
              </Text>

              {!isLoading && results.length > 0 ? (
                <View className="flex-row items-center mt-3">
                  <View className="bg-[#EEF2FF] rounded-lg px-2.5 py-1 mr-2">
                    <Text className="text-[11px] font-pmedium text-[#1F41BB]">
                      {globalCurrency?.currency || 'GHS'}
                    </Text>
                  </View>
                  <Text className="text-[11px] font-pregular text-[#64748B]">
                    Spent {globalCurrency?.symbol || ''}
                    {totalSpent.toFixed(2)} in these results
                  </Text>
                </View>
              ) : null}
            </View>
          }
          ListFooterComponent={
            isLoading ? (
              <ActivityIndicator color="#1F41BB" style={{ marginTop: 16 }} />
            ) : null
          }
          ListEmptyComponent={
            isLoading ? null : (
              <EmptyState
                title="No transactions found"
                subtitle="Try a different category, item or amount."
                actionLabel="Clear search"
                onAction={() => router.setParams({ query: '' })}
                icon="search-outline"
              />
            )
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Search;
