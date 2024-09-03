import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from "@expo/vector-icons";
import { deleteExpense } from '../lib/appwrite';
import { categoriesIcons } from '../partials/categoryIcons';

const Expense = ({ amount, category, item, expenseType, purchaseDate, index }) => {
  const date = new Date(purchaseDate.split('T')[0]);
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayOfWeek = days[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  if (expenseType !== 'Expense') {
    return null; // Render nothing if expenseType is not 'Expense'
  }

  // Find the corresponding icon for the category
  const categoryIconObj = categoriesIcons.categoriesWithIcons.find(cat => cat.category === category);
  const icon = categoryIconObj ? categoryIconObj.icon : 'list-outline'; // Default icon if category is not found

  const deleteThisExpense = () => {
    try {
      Alert.alert('Are you sure you want to delete this item?', 'if yes tap on OK', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK', 
          onPress: async () => { 
            await deleteExpense(index);
            Alert.alert("Success", "Item deleted! Refresh for update");
          }
        }
      ]);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <View>
      <View className="flex-row items-center bg-white p-[15px] rounded-[10px] mb-2.5 h-[70px]">
        <View className="bg-[#E8E9EB] w-[46px] h-[46px] rounded-lg border border-neutral-50 justify-center items-center">
          <Icon name={icon} size={24} color="#000" />
        </View>
        <View className="flex-1 ml-2.5 pl-1">
          <Text className="text-[16px] font-mbold pb-1">{item}</Text>
          <Text className="text-gray-500 font-mregular">{dayOfWeek} {month} {day < 10 ? '0' + day : day} {year}</Text>
        </View>
        <View className="flex-col gap-3">
          <TouchableOpacity onPress={deleteThisExpense} className="items-end">
            <Ionicons name="trash" size={20} color='#E74C3C' />
          </TouchableOpacity>
          <Text className="text-[17px] text-right font-mbold text-[#E74C3C]" numberOfLines={1}>-{amount}</Text>
        </View>
      </View>
    </View>
  );
};

export default Expense;
