import { Text, View, Image } from 'react-native'
import React from 'react'
import { Tabs, Redirect } from 'expo-router'
import {icons} from '../../../constants'

const TabIcon = ({ icon_ac, icon_inac, color, name, focused, size}) => {
    return (
        <View className="items-center justify-between gap-1">
            <Image 
                source={`${focused ? icon_ac : icon_inac}`}
                resizeMode="contain"
                tintColor={color}
                className={size}
            />
            <Text 
                className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}
                style={{ color: color}}
            >
                {name}
            </Text>
        </View>
    )
}

const TabsLayout = () => {
  return (
    <>
    <Tabs screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#20B54B',
        tabBarInactiveTintColor: '#BFC0C0',
        tabBarStyle: {
            backgroundColor: '#FFF',
            borderTopWidth: 1,
            borderRadius: 10,
            borderTopColor: '#F9F4F5',
            height: 90,
            paddingHorizontal: 10,
            paddingTop: 10,

        }

    }}>
        <Tabs.Screen 
        name="home"
        options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
                <TabIcon
                    icon_ac={icons.home}
                    icon_inac={icons.home}
                    color={color}
                    name="home"
                    focused={focused}
                    size="w-6 h-6"
                />
            ),
        }}
        />



<Tabs.Screen 
        name="add-expense"
        options={{
            title: 'AddExpense',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
                <View className="">
                <TabIcon
                    icon_ac={icons.add_ac}
                    icon_inac={icons.add_inac}
                    color={color}
                    name='add expense'
                    focused={focused}
                    size="w-7 h-7"
                />
                </View>
              
            )
        }}
        />


<Tabs.Screen 
        name="settings"
        options={{
            title: 'Settings',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
                <TabIcon
                    icon_ac={icons.settings_inac}
                    icon_inac={icons.settings_inac}
                    color={`${focused ? '#20B54B' : color}`}
                    name= 'settings' 
                    focused={focused}
                    size="w-6 h-6"

                />
            )
        }}
        />
    </Tabs>
    </>
  )
}

export default TabsLayout