import { StyleSheet, ScrollView, Text, View, Image, TouchableOpacity, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Drawer } from 'expo-router/drawer'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../../../constants'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../../../../context/GlobalProvider';
import { FlatList } from 'react-native-gesture-handler'
import CustomButton from '../../../../components/CustomButton'
import Expense from '../../../../components/ExpenseItem'
import EmptyState from '../../../../components/EmptyState'
import { getRecentPosts } from '../../../../lib/appwrite'
import useAppwrite from '../../../../lib/useAppwrite'
import CustomCalendar from '../../../../components/CustomCalendar'
import { getAllPosts } from '../../../../lib/appwrite'
import { router } from 'expo-router'

const Home = () => {
  const navigation = useNavigation();
  const { user, setUser, setIsLoggedIn } = useGlobalContext()

  const { data: recentPosts, refetch } = useAppwrite({
    fn: () => getRecentPosts(user?.$id)
  });

  const [refreshing, setRefreshing] = useState(false)

  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('GHS');
  const [currencies, setCurrencies] = useState([]);
  
  const [exchangeRate, setExchangeRate] = useState('0');
  const [amount, setAmount] = useState('');

  const convertCurrency = () => {
    const result = (1 * exchangeRate).toFixed(2);
    return result;
  };

 
  const onRefresh = async () => {
    setRefreshing(true)
    // Recall new expenses
    await refetch();
    setRefreshing(false)
  }

  const toggleDrawer = () => {
    navigation.toggleDrawer();
  };


  useEffect(() => {
    const fetchCurrencies = async () => {
     try {
       const response = await fetch(
         'https://v6.exchangerate-api.com/v6/0e6303693a5b845f4814341f/latest/USD' //api
        );
  
        const data = await response.json();
        setCurrencies(Object.keys(data.conversion_rates));
        setExchangeRate(data.conversion_rates[toCurrency]);
    }	catch (error) {
      console.log(error);
    }
  };
  
  fetchCurrencies();
  }, [toCurrency]);

  return (
    
    <>
    {/* <StatusBar hidden="true" /> */}
    <Drawer.Screen 
      options={{
        headerShown: false,
        gestureEnabled: false,      
      }}/>
        <View className=" bg-white">
            <View className="flex-row px-5 mt-[60px] mb-5">
            <View>
                <TouchableOpacity onPress={toggleDrawer}>
                <Image className="w-[40px] h-[40px] rounded-[20px]" source={images.profile_picture}/> 
              </TouchableOpacity> 
            </View >
            <View className="flex-1 items-center pt-2">
              <Text className="text-xl font-mbold">Yo! <Text className="font-mregular">{user?.username?.toUpperCase()}</Text> </Text>
            </View>

            <View>
              <TouchableOpacity>
                <Ionicons name="notifications-outline" size={32} color="#000" />
              </TouchableOpacity>
            </View>
            </View>
        </View>
        <SafeAreaView className="flex-1">
        <View className="flex-1 px-[20px] bg-gray -mt-6 rounded-t-xl">
          <View className="flex-row font-mbold justify-between w-[200px]">

            <View style={[styles.summaryBox, styles.activeSummaryBox]} className="-ml-[3px]">
              <View className="flex-row gap-[50px]">
                <Ionicons name="card-outline" size={26} color="#FFF" className="-ml-5"/>
                <Text className="font-mbold text-3xl text-white">GHS</Text>
              </View>
              <View className="flex-row gap-4">
                <Text style={[styles.summaryText, styles.activeSummaryText]}>Total{'\n'}Expense </Text>
                <Text style={[styles.summaryAmount, styles.activeSummaryAmount]} className="pt-3">298.16</Text>
              </View>
            </View>

            <View style={styles.summaryBox}>
                <Ionicons name="cash-outline" size={24} color="#000" />
                <Text style={styles.summaryText}>Exchange Rate</Text>
                <Text style={styles.summaryAmount}>1 USD = GHS {convertCurrency()}</Text>
            </View>
          </View>
          
          <View className=" bg-white rounded-xl h-[125px] mt-5">
            <CustomCalendar />
          </View>

          <View className="flex-row justify-between items-center mt-5 mb-1">
                <Text className="text-[22px] font-pextrabold">Recent Expenses</Text>
                <TouchableOpacity onPress={() => router.push('/(drawer)/my-expense')}>
                  <Text className="font-pbold text-[#3c3e3b]">View All</Text>
                </TouchableOpacity>
            </View>

        <View className="">
          <FlatList 
            data={recentPosts}
            showsVerticalScrollIndicator='false'
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => {
              return (
                <View>
                  <Expense 
                    amount={item.ItemAmount} 
                    category={item.category} 
                    purchaseDate={item.dateofpurchase}
                    />
                </View>
              );
            }}
            ListEmptyComponent={() => (
              <EmptyState title="No Expense Available" subtitle="You have no purchase"/>
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
           
          /> 
        </View>

      
{/* 
      <CustomButton 
        title="scroll to the end" 
        onPress={() => {
          ref.current?.scrollToEnd()
        }} /> */}

    </View>

    </SafeAreaView>
    </>
  );
};


const styles = StyleSheet.create({
  summaryContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 20,
  height: 140,
  width: 200
},
summaryBox: {
  backgroundColor: '#FFF',
  padding: 15,
  borderRadius: 10,
  alignItems: 'start',
  marginHorizontal: 5,
},
activeSummaryBox: {
  backgroundColor: '#0161c7',
  width: 165,
},
summaryText: {
  marginTop: 10,
  fontSize: 16,
  paddingTop: 7,
  color: '#000',
},
activeSummaryText: {
  color: '#FFF',
},
summaryAmount: {
  marginTop: 5,
  fontSize: 18,
  fontWeight: 'bold',
  color: '#000',
},
activeSummaryAmount: {
  color: '#FFF',
  fontSize: 24
}
})

export default Home