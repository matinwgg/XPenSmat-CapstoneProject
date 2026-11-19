import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { deleteExpense } from '../lib/appwrite';
import { categoriesIcons } from '../partials/categoryIcons';
import { useGlobalContext } from '../context/GlobalProvider';
import { formatCurrency, formatDateLabel } from '../lib/format';

/**
 * Compact expense row shown on the home dashboard.
 */
const Expense = ({
  amount,
  category,
  item,
  expenseType,
  purchaseDate,
  index,
  onDeleted,
}) => {
  const { globalCurrency } = useGlobalContext();
  const symbol = globalCurrency?.symbol || '';

  if (expenseType !== 'Expense') {
    return null;
  }

  const categoryIconObj = categoriesIcons.categoriesWithIcons.find(
    (cat) => cat.category === category
  );
  const icon = categoryIconObj ? categoryIconObj.icon : 'pricetag-outline';

  const deleteThisExpense = () => {
    Alert.alert(
      'Delete transaction?',
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(index);
              if (typeof onDeleted === 'function') onDeleted();
            } catch (error) {
              console.error('Error deleting expense:', error);
              Alert.alert('Could not delete', 'Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 mb-3">
      <View className="w-11 h-11 rounded-xl bg-[#EEF2FF] items-center justify-center">
        <Ionicons name={icon} size={22} color="#1F41BB" />
      </View>

      <View className="flex-1 ml-3">
        <Text
          className="text-[15px] font-psemibold text-[#0F172A]"
          numberOfLines={1}
        >
          {item || category || 'Expense'}
        </Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-[11px] font-pregular text-[#64748B]">
            {formatDateLabel(purchaseDate)}
          </Text>
          {category ? (
            <>
              <View className="w-1 h-1 rounded-full bg-[#CBD5E1] mx-2" />
              <Text
                className="text-[11px] font-pregular text-[#64748B] flex-shrink"
                numberOfLines={1}
              >
                {category}
              </Text>
            </>
          ) : null}
        </View>
      </View>

      <View className="items-end ml-2">
        <Text
          className="text-[15px] font-psemibold text-[#DC2626]"
          numberOfLines={1}
        >
          -{formatCurrency(amount, { symbol })}
        </Text>
        <TouchableOpacity
          onPress={deleteThisExpense}
          hitSlop={10}
          className="mt-1 p-1"
          accessibilityRole="button"
          accessibilityLabel={`Delete ${item || 'transaction'}`}
        >
          <Ionicons name="trash-outline" size={15} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Expense;
