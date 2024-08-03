import React from 'react'
import { ScrollView, Text, View, KeyboardAvoidingView, TouchableOpacity, Image } from 'react-native'
import { icons } from '../../constants'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer'
// import { DrawerContent } from '@react-navigation/drawer';
import CustomDrawerContent from '../../components/CustomDrawercontent';

const DrawerLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Drawer 
      drawerContent={(props) => <CustomDrawerContent {...props}/>}
      screenOptions={{ 
        headerShown: false, 
        drawerHideStatusBarOnOpen: true,
        //drawerActiveBackgroundColor: '#1F41BB',
        //drawerActiveTintColor: '#1F41BB',
        swipeEdgeWidth: 0, 
        swipeEnabled: false, 
        drawerLabelStyle: { marginLeft: -20, fontFamily: 'Poppins-Regular', fontSize: 15}, 
        //drawerStyle: {marginTop: 50 }
      }}>
      <Drawer.Screen 
        name="(tabs)"
        options={{
          drawerLabel: "Home",
          title: "Home",
          drawerIcon: () => (
            <Image 
            source={icons.dhome}
            resizeMode='contain'
            className="w-[26px] h-[26px]"
            />
        ),
        swipeEnabled: false,
          
        }}
      />
      <Drawer.Screen 
      name="my-expense"
      options={{
        drawerLabel: "My Expenses",
        headerTitle: "Expenses",
        drawerIcon: () => (
            <Image 
            source={icons.wallet} 
            resizeMode='contain'
            className="w-6 h-6"

            />
        )
      }}
      />
      <Drawer.Screen 
      name="profile"
      options={{
        drawerLabel: "Profile",
        drawerStyle: {
          backgroundColor: 'yellow',
          width: 240,
        },
        headerTitle: "Profile",
        drawerIcon: ({ size, color }) => (
          <Image 
          source={icons.profile_} 
          resizeMode='contain'
          className="w-[27px] h-[27px]"

          />
        )
      }}
      />

      <Drawer.Screen 
      name="(wset-reminders)"
      options={{
        drawerLabel: "Set reminders",
        headerTitle: "Add to reminder",
        drawerIcon: ({ size, color }) => (
          <Image 
          source={icons.budget} 
          resizeMode='contain'
          className="w-7 h-7"

          />
        )
      }}
      />

      <Drawer.Screen 
      name="currency-conversion"
      options={{
        drawerLabel: "Convert currency",
        headerTitle: "",
        drawerIcon: ({ size, color }) => (
          <Image 
            source={icons.moneychange} 
            resizeMode='contain'
            className="w-7 h-7"

            />
        )
      }}
      />
 </Drawer>
  
    </GestureHandlerRootView>

  )
}

export default DrawerLayout
