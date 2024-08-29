import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from "@expo/vector-icons";
import { deleteExpense } from '../lib/appwrite';

const Expense = ({ amount, category, item, purchaseDate, index }) => {
  const date = new Date(purchaseDate.split('T')[0])
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

   const dayOfWeek = days[date.getDay()];
   const month = months[date.getMonth()];
   const day = date.getDate();
   const year = date.getFullYear();

  //list people-outline receipt-outline  cart-outline
  let icon  = '' 

  switch (category) {
    case 'General': icon ="receipt-outline"
                    break;
    case 'Education': icon ="book-outline"
                    break;

    case 'Food':    icon ="fast-food-outline"
                    break;

    case 'Rent':    icon ="home-outline"
                    break;    

    case 'Medical': icon ="medical-outline"
                    break;

    case 'Social Event': icon ="people-outline"
                        break;

    case 'Shopping':  icon ="cart-outline"
                      break;
    
    case 'Travel':    icon ="bicycle-outline"
    break;

    case 'Miscelleneous': icon ="list"
                      break;
    default: icon ='list'
              break;         
        }
    const deleteThisExpense =  () => {
      try {
        Alert.alert('Deleting...', 'Are you sure you want to delete this item?', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK', 
            onPress: async () => { 
              await deleteExpense(index)
              Alert.alert("Success", "Item deleted!")

            }
          }
        ])
      } catch (error) {
        
      }
    };
  return (
    <View >
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
                <Ionicons name="trash" size={20} color='red' />
              </TouchableOpacity>
              <Text className="text-[16px] text-right font-mbold text-[#E74C3C]" numberOfLines={1}>GhS{amount}</Text>
            </View>
        </View>

    </View>
  )
};

export default Expense;