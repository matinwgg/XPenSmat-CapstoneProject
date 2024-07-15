import { View, Text } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Expense = ({expenseData: {createdAt, itemAmount, category, creator: {username, avartar, dateOfPurchase, item, modeOfpayment}}}) => {
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
  return (
    <View >
        <View className="flex-row items-center bg-white p-[15px] rounded-[10px] mb-2.5 h-[70px]">
            <View className="bg-[#E8E9EB] w-[46px] h-[46px] rounded-lg border border-neutral-50 justify-center items-center">
              <Icon name={icon} size={24} color="#000" />
            </View>
            <View className="flex-1 ml-2.5 pl-1">
                <Text className="text-[16px] font-mbold pb-1">{category}</Text>
                <Text className="text-[#777] font-mregular">{dateOfPurchase}</Text>
            </View>
            <Text className="text-[16px] font-mbold text-[#E74C3C]" numberOfLines={1}>{itemAmount}</Text>
        </View>

    </View>
  )
}

export default Expense