import { StyleSheet, Image, Text, View, SafeAreaView, RefreshControl, TouchableOpacity } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import React, { useState } from 'react'
import { Link, router } from 'expo-router'
import CustomButton from '../../components/CustomButton'
import { icons } from '../../constants'
import EmptyState from '../../components/EmptyState'
import Icon from 'react-native-vector-icons/Ionicons';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import AllExpense from '../../components/ExpenseAll'
import { getAllPosts } from "../../lib/appwrite"
import useAppwrite from '../../lib/useAppwrite'
import { useGlobalContext } from '../../context/GlobalProvider';
import SearchInput from '../../components/SearchInput'
import FeatherIcon from 'react-native-vector-icons/Feather';

const DisplayExpense = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext()

  const { data: posts, refetch } = useAppwrite({
    fn: () => getAllPosts(user?.$id)
  });

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch();     // Recall new expenses
    setRefreshing(false)
  }

  const MButton = ({title}) => (
    <CustomButton 
      title={title}
      textStyles="font-pregular text-[12px]"
      containerStyles="w-[80px] h-10 bg-green-200 border border-gray-200 "
      handlePress={() => {

      }}
    />
  )

  return (
    <>
    <SafeAreaView className="mx-5">
          <View className='w-[10%]'>
          <TouchableOpacity
              onPress={() => {
                router.navigate('\home')
              }}>
              <FeatherIcon
                color="#000"
                name="arrow-left"
                size={24} />

            </TouchableOpacity>
          </View>

          {/* <View className=" flex-row justify-between my-5">
            <MButton title="Today"/>
            <MButton title="This week"/>
            <MButton title="This month"/>
            <MButton title="All"/>
          </View> */}
          <View className="items-center">
            <Text className="font-pbold text-3xl text-[#1F41BB] h-10">History</Text>
          </View>
            <View>
              
            <SearchInput />

            <FlatList 
              data={posts}
              showsVerticalScrollIndicator='false'
              keyExtractor={(item) => item.$id}
              renderItem={({ item }) => {
                return (
                  <AllExpense expenseData={item} />
                )
              }}
              ListEmptyComponent={() => (
                <EmptyState title="No Expense Available" subtitle="You have no purchase"/>
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }

            /> 
        </View>

      </SafeAreaView>
      </>
      
  )
}

const styles = StyleSheet.create({
  container: {
    },    
card: {
  backgroundColor: '#FFF',
  padding: 10,
  borderRadius: 10,
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
},
});
export default DisplayExpense
