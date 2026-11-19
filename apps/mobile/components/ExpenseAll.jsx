import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useGlobalContext } from '../context/GlobalProvider';
import { formatCurrency, formatDateLabel } from '../lib/format';

/**
 * Transaction row used inside the grouped history cards. Unlike the home row
 * this one also renders income, so the history screen is a complete ledger.
 */
const ExpenseItem = ({ expenseData }) => {
  const { globalCurrency } = useGlobalContext();
  const symbol = globalCurrency?.symbol || '';

  const {
    ItemAmount,
    dateofpurchase,
    createdAt,
    item,
    modeOfPayment,
    type,
    category,
  } = expenseData || {};

  const isIncome = type === 'Income';
  const amount = Number(ItemAmount) || 0;

  return (
    <View className="flex-row items-center py-3">
      <View
        className="w-10 h-10 rounded-xl items-center justify-center"
        style={{ backgroundColor: isIncome ? '#DCFCE7' : '#FEE2E2' }}
      >
        <Ionicons
          name={isIncome ? 'arrow-down-outline' : 'arrow-up-outline'}
          size={19}
          color={isIncome ? '#16A34A' : '#DC2626'}
        />
      </View>

      <View className="flex-1 ml-3 pr-2">
        <Text
          className="text-[15px] font-psemibold text-[#0F172A]"
          numberOfLines={1}
        >
          {item || category || (isIncome ? 'Income' : 'Expense')}
        </Text>
        <Text
          className="text-[11px] font-pregular text-[#64748B] mt-0.5"
          numberOfLines={1}
        >
          {formatDateLabel(dateofpurchase || createdAt)}
          {modeOfPayment ? ` · ${modeOfPayment}` : ''}
        </Text>
      </View>

      <Text
        className="text-[14px] font-psemibold"
        style={{ color: isIncome ? '#16A34A' : '#DC2626' }}
        numberOfLines={1}
      >
        {isIncome ? '+' : '-'}
        {formatCurrency(amount, { symbol })}
      </Text>
    </View>
  );
};

export default ExpenseItem;
