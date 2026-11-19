import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Drawer } from 'expo-router/drawer';
import DateTimePicker from '@react-native-community/datetimepicker';
import RBSheet from 'react-native-raw-bottom-sheet';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import Ionicons from '@expo/vector-icons/Ionicons';
import DropdownComponent from '../../../../partials/DropdownComponent';
import TextField from '../../../../components/TextField';
import CustomButton from '../../../../components/CustomButton';
import { upLoadExpense } from '../../../../lib/appwrite';
import { useGlobalContext } from '../../../../context/GlobalProvider';
import { formatDateLabel } from '../../../../lib/format';

const emptyExpenseForm = {
  item: '',
  description: '',
  category: '',
  amount: '',
  type: '',
  dateOfPurchase: '',
  paymentMode: '',
};

const emptyIncomeForm = {
  description: '',
  category: '',
  amount: '',
  type: '',
  dateOfPurchase: '',
  paymentMode: '',
};

const AddExpense = () => {
  const sheet = useRef();
  const { user, globalCurrency } = useGlobalContext();
  const symbol = globalCurrency?.symbol || '';

  const [transactionType, setTransactionType] = useState('Expense');
  const [date, setDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customExpenseCategory, setCustomExpenseCategory] = useState(false);
  const [customIncomeCategory, setCustomIncomeCategory] = useState(false);

  const [expenseForm, setExpenseForm] = useState(emptyExpenseForm);
  const [incomeForm, setIncomeForm] = useState(emptyIncomeForm);

  const isExpenseTab = transactionType === 'Expense';
  const form = isExpenseTab ? expenseForm : incomeForm;
  const setForm = isExpenseTab ? setExpenseForm : setIncomeForm;
  const categoryValue = form.category;
  const showCustomCategory = isExpenseTab
    ? customExpenseCategory
    : customIncomeCategory;

  const updateForm = (patch) => {
    setForm((previous) => ({ ...previous, ...patch }));
  };

  const itemValue = isExpenseTab ? form.item : form.description;

  const formReady = useMemo(
    () =>
      Boolean(
        String(itemValue || '').trim() &&
          String(form.amount || '').trim() &&
          Number(form.amount) > 0 &&
          form.category &&
          form.category !== 'none' &&
          form.dateOfPurchase &&
          form.paymentMode
      ),
    [itemValue, form.amount, form.category, form.dateOfPurchase, form.paymentMode]
  );

  const resetForms = () => {
    setExpenseForm(emptyExpenseForm);
    setIncomeForm(emptyIncomeForm);
    setCustomExpenseCategory(false);
    setCustomIncomeCategory(false);
  };

  const submit = async () => {
    const item = isExpenseTab ? form.item : form.description;
    const amount = parseFloat(form.amount);

    if (!item?.trim() || !form.category || !form.dateOfPurchase || !form.paymentMode) {
      return Alert.alert('Missing details', 'Please fill in all the fields.');
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return Alert.alert('Invalid amount', 'Enter an amount greater than zero.');
    }

    setIsSubmitting(true);

    try {
      await upLoadExpense(
        item,
        form.description,
        form.category,
        amount,
        transactionType,
        form.dateOfPurchase,
        form.paymentMode,
        user?.$id
      );

      Alert.alert(
        'Transaction saved',
        isExpenseTab
          ? 'Your expense has been added.'
          : 'Your income has been added.'
      );
      resetForms();
      setDate(new Date());
      sheet.current?.close();
    } catch (error) {
      Alert.alert('Could not save', error?.message || 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    if (event?.type === 'set' && selectedDate) setDate(selectedDate);
  };

  const confirmDate = () => {
    updateForm({ dateOfPurchase: date.toDateString() });
    sheet.current?.close();
  };

  const onSelectCategory = (value) => {
    if (value === 'none') {
      updateForm({ category: '' });
      if (isExpenseTab) setCustomExpenseCategory(true);
      else setCustomIncomeCategory(true);
      return;
    }

    updateForm({ category: value });
    if (isExpenseTab) setCustomExpenseCategory(false);
    else setCustomIncomeCategory(false);
  };

  const displayDate = form.dateOfPurchase
    ? formatDateLabel(form.dateOfPurchase)
    : '';

  return (
    <>
      <Drawer.Screen options={{ headerShown: false, gestureEnabled: false }} />

      <SafeAreaView className="flex-1 bg-[#F5F7FB]" edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="mt-2 mb-5">
              <Text className="text-[24px] font-psemibold text-[#0F172A]">
                Add transaction
              </Text>
              <Text className="text-[13px] font-pregular text-[#64748B] mt-1">
                Record what you spent or received.
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-4 mb-4">
              <SegmentedControl
                values={['Expense', 'Income']}
                selectedIndex={isExpenseTab ? 0 : 1}
                onChange={(event) => {
                  const index = event.nativeEvent.selectedSegmentIndex;
                  setTransactionType(index === 0 ? 'Expense' : 'Income');
                }}
                style={{ height: 38 }}
                tintColor="#1F41BB"
                activeFontStyle={{ fontFamily: 'Poppins-SemiBold' }}
              />
            </View>

            <View
              className="bg-white rounded-2xl p-4"
              style={{
                shadowColor: '#0F172A',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 12,
                elevation: 2,
              }}
            >
              {isExpenseTab ? (
                <>
                  <TextField
                    value={expenseForm.item}
                    placeholder="Money spent on"
                    handleTextChange={(value) => updateForm({ item: value })}
                    containerStyle="mb-4"
                    rightAccessory={
                      <Ionicons name="cart-outline" size={18} color="#94A3B8" />
                    }
                  />
                  <TextField
                    value={expenseForm.description}
                    placeholder="Description"
                    handleTextChange={(value) => updateForm({ description: value })}
                    containerStyle="mb-4"
                  />
                </>
              ) : (
                <TextField
                  value={incomeForm.description}
                  placeholder="Source of income"
                  handleTextChange={(value) => updateForm({ description: value })}
                  containerStyle="mb-4"
                  rightAccessory={
                    <Ionicons name="briefcase-outline" size={18} color="#94A3B8" />
                  }
                />
              )}

              <View className="flex-row">
                <View style={{ flex: 1, marginRight: 10 }}>
                  <TextField
                    value={form.amount}
                    placeholder="Amount"
                    prefix={symbol || globalCurrency?.currency}
                    handleTextChange={(value) => updateForm({ amount: value })}
                    keyType="decimal-pad"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <DropdownComponent
                    paymentMode
                    placeholder={isExpenseTab ? 'Payment mode' : "Received through"}
                    value={form.paymentMode}
                    setValue={(value) => updateForm({ paymentMode: value })}
                  />
                </View>
              </View>

              <View className="mt-4">
                <DropdownComponent
                  Category={transactionType}
                  placeholder="Category"
                  value={categoryValue || null}
                  setValue={onSelectCategory}
                />
              </View>

              {showCustomCategory ? (
                <View className="mt-3">
                  <TextField
                    value={categoryValue}
                    placeholder={
                      isExpenseTab ? 'Type a category' : 'Type a source'
                    }
                    handleTextChange={(value) => updateForm({ category: value })}
                  />
                </View>
              ) : null}

              <TouchableOpacity
                onPress={() => sheet.current?.open()}
                activeOpacity={0.8}
                className="mt-4"
                accessibilityRole="button"
                accessibilityLabel="Choose transaction date"
              >
                <View pointerEvents="none">
                  <TextField
                    value={displayDate}
                    placeholder="Select date"
                    editable={false}
                    rightAccessory={
                      <Ionicons name="calendar-outline" size={18} color="#64748B" />
                    }
                  />
                </View>
              </TouchableOpacity>

              <Text className="text-[11px] font-pregular text-[#94A3B8] mt-3">
                All fields are required.
              </Text>

              <CustomButton
                title={isExpenseTab ? 'Add expense' : 'Add income'}
                handlePress={submit}
                isLoading={isSubmitting}
                disabled={!formReady}
                containerStyles="mt-5"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <RBSheet
        ref={sheet}
        height={320}
        openDuration={120}
        closeDuration={100}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: 12,
          },
        }}
      >
        <View className="flex-row items-center justify-between px-5 py-3 border-b border-[#F1F5F9]">
          <TouchableOpacity
            onPress={() => sheet.current?.close()}
            className="py-2 pr-4"
            accessibilityRole="button"
          >
            <Text className="text-[14px] font-pregular text-[#64748B]">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-[15px] font-psemibold text-[#0F172A]">
            Select date
          </Text>
          <TouchableOpacity
            onPress={confirmDate}
            className="py-2 pl-4"
            accessibilityRole="button"
          >
            <Text className="text-[14px] font-psemibold text-[#1F41BB]">Done</Text>
          </TouchableOpacity>
        </View>

        <DateTimePicker
          mode="date"
          display="spinner"
          value={date}
          onChange={onChangeDate}
        />
      </RBSheet>
    </>
  );
};

export default AddExpense;
