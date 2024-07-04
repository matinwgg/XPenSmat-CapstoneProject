import { FlatList, StyleSheet, ScrollView, Text, View, Pressable, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Drawer } from 'expo-router/drawer'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Calendar, ExpandableCalendar } from 'react-native-calendars';
import { icons, images } from '../../../../constants'
import { DrawerToggleButton } from '@react-navigation/drawer'
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from '@expo/vector-icons/Ionicons';


const Home = () => {
 
  return (
    <>
    <Drawer.Screen 
      options={{
        title: "Home",
        headerShown: true,
        headerLeft: () => <DrawerToggleButton />
      }}/>
    <View className="flex-row justify-between items-centre">
            <Pressable 
                // onPress={}
                style={( {pressed} ) => {
                    return { opacity: pressed ? 0.5 : 1}
            }}>
                <Image className="w-[40px] h-[40px] rounded-[20px]"
                    source={images.profile_picture} // Replace with your profile image URL
                /> 
            </Pressable>
            <View className="flex-col">
                <Text className="text-[24px] font-bold">Hi John</Text>
                <Text className="text-[18px] text-[#777]">Welcome</Text>
            </View>
        </View>
    <ScrollView showsVerticalScrollIndicator="false">
    <View className="flex-1 px-[20px] bg-gray">
    <ScrollView showsHorizontalScrollIndicator="false" horizontal>
    <View className="flex-row justify-between mb-5" style={styles.summaryContainer}>
            <View style={[styles.summaryBox]}>
                <Ionicons name="wallet-outline" size={24} color="#000" />
                <Text style={styles.summaryText}>Budget</Text>
                <Text style={styles.summaryAmount}>GHS600.00</Text>
            </View>

            <View style={[styles.summaryBox, styles.activeSummaryBox]}>
                <Ionicons name="card-outline" size={24} color="#FFF" />
                <Text style={[styles.summaryText, styles.activeSummaryText]}>Total Expense</Text>
                <Text style={[styles.summaryAmount, styles.activeSummaryAmount]}>GHS298.16</Text>
            </View>

            <View style={styles.summaryBox}>
                <Ionicons name="cash-outline" size={24} color="#000" />
                <Text style={styles.summaryText}>Exchange Rate</Text>
                <Text style={styles.summaryAmount}>1 USD = GHS6.00</Text>
            </View>
            </View>
    </ScrollView>

    <ScrollView showsVerticalScrollIndicator={false}>

      <View className="h-2">
        <Calendar
          current={'2024-03-01'}
          onDayPress={(day) => { console.log('selected day', day) }}
          theme={{
              todayTextColor: '#00adf5',
          }}
      />
      </View>
</ScrollView>
{/* 
      <FlatList 
        data={list}
        horizontal
        snapToInterval={CARDWIDTHSPACING}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.$id}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={{ marginLeft: spacing.l, marginRight: index === list.length - 1 ? spacing.l : 0 }}>
            
          </TouchableOpacity>
          <Text>{item.id}</Text>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              
              </View>
            </View>
        )}
        
        ListEmptyComponent={() => (
          <EmptyState 
            title="No Expense Entry"
            subtitle="No expenses created yet"
          />
        )}
      /> */}

    </View>
    </ScrollView>
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
  backgroundColor: '#4CAF50',
},
summaryText: {
  marginTop: 10,
  fontSize: 16,
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