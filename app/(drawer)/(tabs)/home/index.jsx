import { StyleSheet, ScrollView, Text, View, Image, TouchableOpacity, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Drawer } from 'expo-router/drawer'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../../../constants'
// import { DrawerToggleButton } from '@react-navigation/drawer'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../../../../context/GlobalProvider';
import { FlatList } from 'react-native-gesture-handler'
import CustomButton from '../../../../components/CustomButton'
// import { StatusBar } from 'expo-status-bar';
// import {Dimensions} from 'react-native';
import Expense from '../../../../components/ExpenseItem'
import EmptyState from '../../../../components/EmptyState'
import { getRecentPosts } from '../../../../lib/appwrite'
import useAppwrite from '../../../../lib/useAppwrite'


const Home = () => {
  const navigation = useNavigation();
  const { data: recentPosts } = useAppwrite(getRecentPosts);

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    // Recall new expenses
    await refetch();
    setRefreshing(false)
  }

  const toggleDrawer = () => {
    navigation.toggleDrawer();
  };

  //console.log(recentPosts)
   
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
              <Text className="text-xl font-mbold">Yo! <Text className="font-mregular">MATIN</Text> </Text>
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
                {/* <View style={[styles.summaryBox]}>
                <Ionicons name="wallet-outline" size={24} color="#000" />
                <Text style={styles.summaryText}>Budget</Text>
                <Text style={styles.summaryAmount}>GHS600.00</Text>
            </View> */}

            <View style={[styles.summaryBox, styles.activeSummaryBox]}>
                <Ionicons name="card-outline" size={26} color="#FFF" />
                <Text style={[styles.summaryText, styles.activeSummaryText]}>Total Expense</Text>
                <Text  style={[styles.summaryAmount, styles.activeSummaryAmount]}>GHS298.16</Text>
            </View>

            <View style={styles.summaryBox}>
                <Ionicons name="cash-outline" size={24} color="#000" />
                <Text style={styles.summaryText}>Exchange Rate</Text>
                <Text style={styles.summaryAmount}>1 USD = GHS6.00</Text>
            </View>
          </View>


          <View className="flex-row justify-between items-center mt-5 mb-1">
                <Text className="text-[22px] font-pextrabold">Recent Expenses</Text>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
                </TouchableOpacity>
            </View>
    
      
        <View className="">
          <FlatList 
            data={recentPosts}
            showsVerticalScrollIndicator='false'
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => {
              return (
                  <TouchableOpacity>
                  <Expense expenseData={item ?? []} />
                </TouchableOpacity>
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
  width: 160,
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
}
})

export default Home