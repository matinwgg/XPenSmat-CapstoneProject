import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { categoryColors, categoryEmojies } from "../constants/summary";

const ExpenseItem = ({expenseData: {createdAt, id, ItemAmount, category, dateofpurchase, item, modeOfPayment}}) => {
  const categoryColor = categoryColors[category || "Default"];
  const emoji = categoryEmojies[category || "Default"];

  const date = new Date(dateofpurchase.split('T')[0])
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

   const dayOfWeek = days[date.getDay()];
   const month = months[date.getMonth()];
   const day = date.getDate();
   const year = date.getFullYear();

  return (
    <View className="flex-1 flex-grow border-gray-400 rounded-xl bg-white pl-1">
      {/* Divider */}
      <View className="w-full self-center h-[1px] bg-gray-200"></View>

      <View className="flex-row pt-[9px] rounded-[10px]  h-[70px]">
          <View className="bg-[#E8E9EB] w-[46px] h-[46px] rounded-lg border border-neutral-50 justify-center items-center">
            <Icon name='cart-outline' size={24} color="#000" />
          </View>

            <View className="flex-col w-full">
              <View className="flex-row">
                  <Text className="text-[18px] flex-1 font-mbold pl-3 pt-1">{item}</Text>
                <Text className="font-nbold text-lg text-right pr-[55px]">${ItemAmount.toFixed(2)}</Text>
              </View>
                
                <View className="-mt-3 pl-3 flex-1 w-[83%]">
                  <Text className="text-[16px] font-mregular text-gray-500">{'\n'}{dayOfWeek} {month} {day < 10 ? '0' + day : day} {year}</Text>
                  <Text className="text-[16px] font-mregular -mt-5" style={{  textAlign: 'right', }}>{modeOfPayment || 'N/A'}</Text>
                </View>

            </View>

        
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
      },    
  card: {
    boxShadow: '5px 1px 3px rgba(25,0,0,0.1)',
  },
  categoryContainer: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
});



export default ExpenseItem;