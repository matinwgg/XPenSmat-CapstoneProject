import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

/**
 * Option lists for the category / payment dropdowns.
 *
 * The `value` is what gets stored on the transaction, so the label and value
 * are intentionally identical for categories. (Previously the second half of
 * the expense list stored icon names such as `bus-outline` as the category,
 * which made every grouped report show icon names instead of categories.)
 *
 * `withCustomOption` prepends the "please specify" entry used by the add
 * transaction screen.
 */
const CUSTOM_OPTION = { label: 'Other (type your own)', value: 'none' };

const expenseCategoryLabels = [
  'Groceries',
  'Rent',
  'Utilities',
  'Dining Out',
  'Food',
  'Transportation',
  'Fuel',
  'Taxi',
  'Public Transport',
  'Car Maintenance',
  'Parking',
  'Shopping',
  'Clothing',
  'Electronics',
  'Household Items',
  'Furniture',
  'Home Maintenance',
  'Repairs',
  'Cleaning',
  'Health',
  'Medical',
  'Insurance',
  'Fitness',
  'Gym',
  'Education',
  'Books',
  'Entertainment',
  'Movies',
  'Music',
  'Games',
  'Streaming',
  'Subscriptions',
  'Internet',
  'Phone',
  'Personal Care',
  'Beauty',
  'Childcare',
  'Pets',
  'Social Event',
  'Parties',
  'Gifts',
  'Donations',
  'Charity',
  'Loans',
  'Savings',
  'Investments',
  'Travel',
  'Flights',
  'Hotels',
  'Vacation',
  'Sports',
  'Hobbies',
  'Business',
  'Software',
  'Memberships',
];

const incomeCategoryLabels = [
  'Salary/Wages',
  'Freelancing/Consulting',
  'Business Income',
  'Investments',
  'Real Estate',
  'Royalties',
  'Online Sales',
  'Part-Time Jobs',
  'Side Gigs',
  'Bonuses',
  'Pensions/Retirement Funds',
  'Government Benefits',
  'Grants/Scholarships',
  'Affiliate Marketing',
  'Crowdfunding',
  'Peer-to-Peer Lending',
  'Inheritance',
  'Gifts/Donations',
  'Dividends',
  'Stock Market Trading',
];

const toOptions = (labels, withCustomOption = true) => {
  const options = labels.map((label) => ({ label, value: label }));
  return withCustomOption ? [CUSTOM_OPTION, ...options] : options;
};

export const expenseCategories = toOptions(expenseCategoryLabels);
export const incomeCategories = toOptions(incomeCategoryLabels);

const transactionTypeData = [
  { label: 'Expense', value: 'Expense' },
  { label: 'Income', value: 'Income' },
];

/**
 * Payment modes. Values are lower-case so they compare reliably, and the list
 * no longer contains two entries with the same value.
 */
const paymentData = [
  { label: 'Cash', value: 'cash' },
  { label: 'Mobile money', value: 'mobile money' },
  { label: 'Bank transfer', value: 'bank transfer' },
  { label: 'Card', value: 'card' },
  { label: 'Wallet', value: 'wallet' },
  { label: 'Cheque', value: 'cheque' },
  { label: 'PayPal', value: 'paypal' },
  { label: 'Apple Pay', value: 'apple pay' },
  { label: 'Cryptocurrency', value: 'cryptocurrency' },
  { label: 'Other', value: 'other' },
];

const DropdownComponent = ({
  paymentMode,
  transactionType,
  Category,
  placeholder,
  value,
  setValue,
}) => {
  const [isFocus, setIsFocus] = useState(false);

  const selectedData = useMemo(() => {
    if (paymentMode) return paymentData;
    if (Category) {
      return Category === 'Expense' ? expenseCategories : incomeCategories;
    }
    return transactionTypeData;
  }, [paymentMode, Category]);

  return (
    <View>
      <Dropdown
        style={[styles.dropdown, isFocus && styles.dropdownFocused]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={selectedData}
        maxHeight={240}
        containerStyle={styles.container}
        itemTextStyle={styles.itemTextStyle}
        activeColor="#EEF2FF"
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  dropdownFocused: {
    borderColor: '#1F41BB',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  itemTextStyle: {
    color: '#0F172A',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#94A3B8',
  },
  selectedTextStyle: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#0F172A',
  },
  inputSearchStyle: {
    height: 44,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#0F172A',
    borderRadius: 10,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
