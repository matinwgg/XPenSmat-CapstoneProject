import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { extend } from 'validate.js';

const AllExpense = ({expenseData: {createdAt, id, itemAmount, category, creator: {username, avartar, dateOfPurchase, item, modeOfpayment}}}) => {
   const [stuff, setStuff] = useState([
     { amount: {itemAmount}, category: {category}, purchaseDate: {dateOfPurchase}, itemPurchased: {item}, paymentMode: {modeOfpayment}, key: {id}}
   ])

   
  return (
     <View >
        { stuff.map((some_item) => {
          return (
            <View key={some_item.key} className="flex-1 flex-grow border-gray-400 rounded-xl bg-white pt-4 pl-3 mb-10">
              <Text className="font-pbold justify-start text-3xl">{category}</Text> 
              {/* Divider */}
              <View className="w-[300px] self-center h-[1px] bg-gray-200 mx-10 mt-3"></View>

              <View className="flex-row self-start pt-[9px] rounded-[10px]  h-[70px]">
                  <View className="bg-[#E8E9EB] w-[46px] h-[46px] rounded-lg border border-neutral-50 justify-center items-center">
                    <Icon name='cart-outline' size={24} color="#000" />
                  </View>

                    <View className="flex-col">
                      <View className="flex-row">
                        <Text className="text-[18px] font-mbold pl-3 pt-1">Rent</Text>
                        <Text className="font-nbold text-lg pl-[52%]" numberOfLines={1}>$2,000</Text>
                      </View>
                        
                        <View className="-mt-3 pl-3">
                          <Text className="text-[16px] font-mregular">{'\n'}25-04-2024</Text>
                        </View>
                    </View>

               
              </View>
            </View>
          )
        })}
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
});



export default AllExpense;