import { View, Text } from 'react-native'
import { Drawer } from 'expo-router/drawer'
import React from 'react'
import { DrawerToggleButton } from '@react-navigation/drawer'

const Settings = () => {
  return (
    <>
    <Drawer.Screen 
    options={{
      title: "Notifications",
      headerShown: true,
      headerLeft: () => <DrawerToggleButton />
    }}/>
    <View>
      <Text>Settings</Text>
    </View>
    </>
  )
}

export default Settings